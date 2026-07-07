# Avenue Residence — Sozlash va Deploy qo'llanmasi

Bu loyihada 3 ta fayl bor:

- `index.html` — landing page (dizayn + matn + forma)
- `apps-script/Code.gs` — lead'larni Google Sheets va Telegram'ga yuboruvchi skript
- `SETUP.md` — shu qo'llanma

Quyidagi qadamlarni tartib bilan bajaring.

---

## 1-QADAM — Google Sheets jadval yaratish

1. [sheets.google.com](https://sheets.google.com) ga kiring va **Blank spreadsheet** oching.
2. Jadvalga tushunarli nom bering, masalan: `Avenue Residence — Leadlar`.
3. Pastdagi varaq nomini (`Sheet1`) o'chirib, o'rniga **Leads** deb nomlang (katta-kichik harf muhim).

## 2-QADAM — Apps Script kodini joylashtirish

1. Jadval ichida yuqoridan **Extensions → Apps Script** ni bosing.
2. Ochilgan muharrirdagi barcha standart kodni o'chirib, [`apps-script/Code.gs`](apps-script/Code.gs) faylining butun tarkibini joylashtiring.
3. Yuqorida loyihaga nom bering (masalan `Avenue Leads Handler`) va **Save** (Ctrl+S) qiling.

## 3-QADAM — Telegram bot (sizniki uchun allaqachon tayyorlandi ✅)

Sizning bot tokeningiz va chat_id'ingiz [`apps-script/Code.gs`](apps-script/Code.gs) faylidagi `oneTimeSetup()` funksiyasiga allaqachon yozib qo'yilgan:

```js
function oneTimeSetup() {
  var props = PropertiesService.getScriptProperties();
  props.setProperty('TELEGRAM_BOT_TOKEN', '8754722944:AAFJnLv1-MyKidN8y3f0S0jxAno3OBSP-3M');
  props.setProperty('TELEGRAM_CHAT_ID', '1553336381');
}
```

Sizga qolgan yagona ish — 2-qadamda kodni joylashtirgach, Apps Script muharriridagi funksiyalar ro'yxatidan **oneTimeSetup** ni tanlab, ▶ **Run** tugmasini bir marta bosish (birinchi marta ruxsat so'raydi — Google hisobingiz bilan tasdiqlang). Shundan keyin token/chat_id xavfsiz tarzda Script Properties'ga saqlanadi.

> ⚠️ **Muhim:** bu token botingizga to'liq kirish huquqini beradi. Uni endi hech qayerga (jamoat kanaliga, GitHub'ga, skrinshotga) qo'ymang. Agar u oshkor bo'lib qolgan deb hisoblasangiz, @BotFather'da `/revoke` buyrug'i orqali istalgan payt yangi token olishingiz mumkin.

> Agar kelajakda boshqa bot/chat ishlatmoqchi bo'lsangiz: @BotFather'da `/newbot`, keyin botga `/start` yozing, so'ng `https://api.telegram.org/botBOT_TOKEN/getUpdates` manzilidan `"chat":{"id":...}` qiymatini oling.

6. Apps Script muharririga qayting, kodning pastki qismidagi `oneTimeSetup()` funksiyasini toping:
   ```js
   function oneTimeSetup() {
     var props = PropertiesService.getScriptProperties();
     props.setProperty('TELEGRAM_BOT_TOKEN', 'BU_YERGA_BOT_TOKENINGIZNI_YOZING');
     props.setProperty('TELEGRAM_CHAT_ID', 'BU_YERGA_CHAT_ID_YOZING');
   }
   ```
   `BU_YERGA_...` qismlarni haqiqiy token va chat_id'ga almashtiring.
7. Yuqoridagi funksiyalar ro'yxatidan **oneTimeSetup** ni tanlang va ▶ **Run** tugmasini bosing (birinchi marta ruxsat so'raydi — Google hisobingiz bilan tasdiqlang).
8. Muvaffaqiyatli ishlagach, xohlasangiz shu funksiyani (yoki ichidagi token qiymatlarini) o'chirib qo'yishingiz mumkin — qiymatlar Script Properties'da xavfsiz saqlanadi.

> Telegram shart emas — agar bu qadamni o'tkazib yuborsangiz, lead'lar baribir Google Sheets'ga tushaveradi.

## 4-QADAM — Web App sifatida deploy qilish

1. Apps Script muharriridagi **Deploy → New deployment** tugmasini bosing.
2. Type sifatida **Web app** ni tanlang (⚙️ belgisi orqali).
3. Quyidagicha sozlang:
   - **Execute as:** Me (sizning hisobingiz)
   - **Who has access:** Anyone
4. **Deploy** tugmasini bosing, kerak bo'lsa ruxsatlarni tasdiqlang.
5. Sizga berilgan **Web app URL** manzilini nusxalang — u shunga o'xshaydi:
   `https://script.google.com/macros/s/AKfycb.../exec`

> Kodni keyinchalik o'zgartirsangiz, har safar **Deploy → Manage deployments → ✏️ → New version** qilib qayta deploy qilishni unutmang, aks holda o'zgarishlar ishlamaydi.

## 5-QADAM — URL'ni landing page'ga ulash

1. [`index.html`](index.html) faylini oching.
2. Fayl oxiridagi `<script>` ichidan quyidagi qatorni toping:
   ```js
   var LEAD_ENDPOINT = 'https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec';
   ```
3. `YOUR_DEPLOYMENT_ID` qismini 4-qadamda olgan haqiqiy URL bilan almashtiring.
4. Faylni saqlang.

Shu bilan forma to'liq ishlaydi: mijoz ismi/telefonini yuborganda — Google Sheets'ga qator qo'shiladi va (sozlangan bo'lsa) Telegram'ga xabar keladi.

### Tekshirish

- Saytni brauzerda oching, formani real telefon raqam bilan to'ldirib yuboring.
- Google Sheets jadvalingizni yangilang — yangi qator paydo bo'lishi kerak.
- Agar ishlamasa: Apps Script muharriridagi **Executions** (chap paneldagi soat belgisi) bo'limidan xatolikni ko'rishingiz mumkin.

---

## 6-QADAM — Matn va rangларni o'zingizga moslashtirish

`index.html` ichida almashtirishingiz kerak bo'lgan asosiy joylar:

| Nima | Qayerda | Izoh |
|---|---|---|
| Kompaniya nomi | `Avenue<span>Residence</span>` (bir necha joyda) | Barcha o'xshash qatorlarni almashtiring |
| Telefon raqam | `tel:+998901234567` va matn qismi | Header va Footer'da |
| Email / Telegram | Footer qismida | `mailto:` va `t.me/...` havolalar |
| Sarlavha matni | `<h1>` ichida | Hero bo'limi |
| Narxlar | `.plan-price` bloklari | 1/2/3 xonali xonadon narxlari |
| Aksiya tugash sanasi | `<script>` ichida `COUNTDOWN_TARGET` | ISO format, masalan `2026-08-31T23:59:59+05:00` |
| Ranglar | `<style>` boshidagi `:root{ --gold: ...; --navy: ...; }` | Fир brend ranglaringizga moslang |

---

## 7-QADAM — Vercel'ga joylash

### Variant A — GitHub orqali (tavsiya etiladi)

1. Shu papkani GitHub'da yangi repository sifatida yuklang:
   ```bash
   git init
   git add .
   git commit -m "Avenue Residence landing page"
   git branch -M main
   git remote add origin https://github.com/USERNAME/avenue-residence.git
   git push -u origin main
   ```
2. [vercel.com](https://vercel.com) ga kiring → **Add New → Project** → GitHub repository'ni tanlang.
3. Framework sifatida **Other** (static) tanlansa yetarli — build buyrug'i kerak emas, chunki bu sof HTML sayt.
4. **Deploy** tugmasini bosing — bir necha soniyada sayt tayyor bo'ladi.

### Variant B — Vercel CLI orqali (tezroq)

```bash
npm install -g vercel
vercel
```

Savollariga default javoblar bilan davom eting — loyiha papkasidagi `index.html` avtomatik aniqlanadi.

---

## Xavfsizlik bo'yicha eslatma

- Telegram bot tokeni faqat Apps Script'ning **Script Properties**'ida saqlanadi — u hech qachon `index.html` yoki brauzer kodiga yozilmaydi, shuning uchun tashqi odam uni ko'ra olmaydi.
- `Who has access: Anyone` sozlamasi shart, chunki sayt tashrif buyuruvchilari anonim holda so'rov yuboradi — bu odatiy va xavfsiz, chunki skript faqat `name`/`phone` qabul qiladi va boshqa hech narsaga ruxsat bermaydi.
