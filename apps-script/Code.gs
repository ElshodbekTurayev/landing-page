/**
 * Avenue Residence — lead qabul qiluvchi Google Apps Script.
 *
 * Bu skript landing page'dagi formadan kelgan har bir ariza (ism, telefon)ni:
 *  1) shu jadvalning "Leads" varag'iga qator qilib yozadi;
 *  2) Telegram bot orqali sizga xabar yuboradi.
 *
 * O'RNATISH QADAMLARI SETUP.md faylida batafsil yozilgan. Qisqacha:
 *  1. Google Sheets'da yangi jadval oching, "Leads" nomli varaq yarating.
 *  2. Extensions -> Apps Script ochib, shu faylning tarkibini joylashtiring.
 *  3. Pastdagi BOT_TOKEN va CHAT_ID qiymatlarini to'ldiring (Script Properties orqali, kod ichiga yozmang).
 *  4. Deploy -> New deployment -> Web app -> Execute as: Me, Who has access: Anyone.
 *  5. Olingan /exec URL'ni index.html ichidagi LEAD_ENDPOINT o'zgaruvchisiga joylashtiring.
 */

function doPost(e) {
  var result = { ok: false };
  try {
    var data = JSON.parse(e.postData.contents);
    var name = (data.name || '').toString().trim();
    var phone = (data.phone || '').toString().trim();
    var source = (data.source || '').toString();
    var page = (data.page || '').toString();

    if (!name || !phone) {
      throw new Error('name yoki phone yetishmayapti');
    }

    appendLeadToSheet(name, phone, source, page);
    notifyTelegram(name, phone, source);

    result.ok = true;
  } catch (err) {
    result.error = err.message;
  }

  return ContentService
    .createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON);
}

function appendLeadToSheet(name, phone, source, page) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Leads');
  if (!sheet) {
    sheet = SpreadsheetApp.getActiveSpreadsheet().insertSheet('Leads');
    sheet.appendRow(['Sana', 'Ism', 'Telefon', 'Sahifa', 'Manba (URL)']);
  }
  sheet.appendRow([new Date(), name, phone, page, source]);
}

function notifyTelegram(name, phone, source) {
  var props = PropertiesService.getScriptProperties();
  var botToken = props.getProperty('TELEGRAM_BOT_TOKEN');
  var chatId = props.getProperty('TELEGRAM_CHAT_ID');

  // Agar Telegram sozlanmagan bo'lsa, jim o'tkazib yuboramiz (Sheets'ga baribir yoziladi).
  if (!botToken || !chatId) return;

  var text = [
    '🆕 Yangi ariza — Avenue Residence',
    '',
    '👤 Ism: ' + name,
    '📞 Telefon: ' + phone,
    source ? ('🔗 Manba: ' + source) : ''
  ].join('\n');

  var url = 'https://api.telegram.org/bot' + botToken + '/sendMessage';
  UrlFetchApp.fetch(url, {
    method: 'post',
    contentType: 'application/json',
    payload: JSON.stringify({ chat_id: chatId, text: text }),
    muteHttpExceptions: true
  });
}

/**
 * Bir martalik sozlash funksiyasi: BOT_TOKEN va CHAT_ID'ni xavfsiz saqlash uchun.
 * Apps Script muharririda bu funksiyani TANLAB, "Run" tugmasini bosing (faqat bir marta).
 * Qiymatlarni pastga o'zingiznikiga almashtiring, so'ng bu funksiyani ishga tushirgach o'chirib tashlashingiz ham mumkin.
 */
function oneTimeSetup() {
  var props = PropertiesService.getScriptProperties();
  props.setProperty('TELEGRAM_BOT_TOKEN', 'BU_YERGA_BOT_TOKENINGIZNI_YOZING');
  props.setProperty('TELEGRAM_CHAT_ID', 'BU_YERGA_CHAT_ID_YOZING');
}
