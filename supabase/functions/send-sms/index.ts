import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface SMSRequest {
  caseId: string;
  phoneNumber: string;
  patientName: string;
  prescription: string;
  medicines: string[];
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { caseId, phoneNumber, patientName, prescription, medicines }: SMSRequest = await req.json();
    
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get Twilio credentials
    const accountSid = Deno.env.get('TWILIO_ACCOUNT_SID');
    const authToken = Deno.env.get('TWILIO_AUTH_TOKEN');
    const fromNumber = Deno.env.get('TWILIO_PHONE_NUMBER');

    if (!accountSid || !authToken || !fromNumber) {
      throw new Error('Twilio credentials not configured');
    }

    // Format SMS message
    const medicinesText = medicines.length > 0 ? medicines.join(', ') : 'None prescribed';
    const message = `Hello ${patientName},

Your prescription is ready:
${prescription}

Medicines: ${medicinesText}

Please collect from the clinic. Contact us for any queries.

- Telemedicine Service`;

    // Send SMS using Twilio
    const twilioUrl = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;
    
    const formData = new URLSearchParams();
    formData.append('To', phoneNumber);
    formData.append('From', fromNumber);
    formData.append('Body', message);

    const twilioResponse = await fetch(twilioUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${btoa(`${accountSid}:${authToken}`)}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData.toString(),
    });

    const twilioResult = await twilioResponse.json();
    
    let smsStatus = 'sent';
    let errorMessage = null;
    
    if (!twilioResponse.ok) {
      smsStatus = 'failed';
      errorMessage = twilioResult.message || 'Failed to send SMS';
      console.error('Twilio SMS failed:', twilioResult);
    }

    // Log SMS attempt in database
    const { error: logError } = await supabase
      .from('sms_logs')
      .insert({
        case_id: caseId,
        phone_number: phoneNumber,
        message: message,
        status: smsStatus,
        error_message: errorMessage,
      });

    if (logError) {
      console.error('Failed to log SMS:', logError);
    }

    // Update medical case SMS status
    const { error: updateError } = await supabase
      .from('medical_cases')
      .update({
        sms_status: smsStatus,
        sms_sent_at: new Date().toISOString(),
        sms_sent: smsStatus === 'sent',
      })
      .eq('id', caseId);

    if (updateError) {
      console.error('Failed to update case SMS status:', updateError);
    }

    return new Response(
      JSON.stringify({
        success: smsStatus === 'sent',
        status: smsStatus,
        error: errorMessage,
        twilioSid: twilioResult.sid,
      }),
      {
        status: twilioResponse.ok ? 200 : 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error: any) {
    console.error('SMS function error:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || 'Internal server error' 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
};

serve(handler);