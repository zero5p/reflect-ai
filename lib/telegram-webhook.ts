export async function setTelegramWebhook(webhookUrl: string) {
  const telegramApiUrl = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/setWebhook`;
  
  try {
    const response = await fetch(telegramApiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: webhookUrl })
    });

    const result = await response.json();
    
    if (result.ok) {
      console.log('Telegram webhook set successfully');
      return true;
    } else {
      console.error('Failed to set Telegram webhook:', result.description);
      return false;
    }
  } catch (error) {
    console.error('Error setting Telegram webhook:', error);
    return false;
  }
}

export async function deleteTelegramWebhook() {
  const telegramApiUrl = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/deleteWebhook`;
  
  try {
    const response = await fetch(telegramApiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });

    const result = await response.json();
    
    if (result.ok) {
      console.log('Telegram webhook deleted successfully');
      return true;
    } else {
      console.error('Failed to delete Telegram webhook:', result.description);
      return false;
    }
  } catch (error) {
    console.error('Error deleting Telegram webhook:', error);
    return false;
  }
}
