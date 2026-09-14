from pathlib import Path
import html

products = [
('Coriander Seeds','Dhania','spice','#a7b56b'),('Cardamom','Elaichi','spice','#6f8f52'),('Cloves','Laung','spice','#4b2f26'),('Cinnamon','Dalchini','spice','#9b5a35'),('Fennel Seeds','Saunf','spice','#b7c57b'),('Fenugreek Seeds','Methi','spice','#b78f43'),('Mustard Seeds','Rai','spice','#d2a52d'),('Ajwain','Carom Seeds','spice','#9d8a65'),('Nigella Seeds','Kalonji','spice','#262626'),('Bay Leaf','Tej Patta','spice','#55704a'),('Star Anise','Star Anise','spice','#6e4931'),('Nutmeg','Jaiphal','spice','#9a6a4c'),('Mace','Javitri','spice','#c77737'),('Dry Ginger','Saunth','spice','#b78355'),('Asafoetida','Hing','spice','#c9a95b'),
('Basmati Rice','Basmati','grain','#f2e8c9'),('Non-Basmati Rice','Rice','grain','#efe5c7'),('Wheat','Gehu','grain','#c8a86a'),('Maize','Corn','grain','#e3bd38'),('Barley','Jau','grain','#b9a36b'),('Sorghum','Jowar','grain','#b65e3b'),('Pearl Millet','Bajra','grain','#77704f'),('Finger Millet','Ragi','grain','#7a3f2d'),('Foxtail Millet','Kangni','grain','#c2a64b'),('Little Millet','Kutki','grain','#b6a66e'),('Barnyard Millet','Sanwa','grain','#aaa07a'),('Kodo Millet','Kodo','grain','#9e8752'),('Proso Millet','Cheena','grain','#c8a949'),('Rice Flour','Rice Flour','grain','#f5efdc'),('Wheat Flour','Atta','grain','#d7c39a'),('Maize Flour','Corn Flour','grain','#e1bc3f'),
('Chickpeas','Chana','pulse','#caa86a'),('Kabuli Chickpeas','Kabuli Chana','pulse','#e3c98f'),('Toor Dal','Arhar Dal','pulse','#d7b54d'),('Moong Dal','Green Gram Dal','pulse','#9eae4c'),('Urad Dal','Black Gram Dal','pulse','#30332c'),('Masoor Dal','Red Lentil','pulse','#c75a46'),('Chana Dal','Split Bengal Gram','pulse','#d9ae4e'),('Green Peas','Matar','pulse','#77a54d'),('Kidney Beans','Rajma','pulse','#8e3b37'),('Black-Eyed Beans','Lobia','pulse','#cdbb8b'),('Black Gram','Urad Whole','pulse','#34342f'),('Soybeans','Soya Bean','pulse','#d0bd7d'),
('Groundnuts','Peanuts','other','#b7834a'),('Sesame Seeds','Til','other','#e5d5aa'),('Flax Seeds','Alsi','other','#9a744e'),('Sunflower Seeds','Sunflower','other','#9c8244'),('Jaggery','Gur','other','#9c5a28'),('Cashew Nuts','Kaju','other','#e3c38e'),('Almonds','Badam','other','#c58d58'),('Walnuts','Akhrot','other','#6e4735'),('Mixed Herbs','Indian Herbs','other','#658354'),('Spice Blends','Blended Spices','other','#b86b34'),
]

colors={'spice':'#b97b3f','grain':'#c8a75b','pulse':'#9b7d45','other':'#7c7651'}
for name,local,cat,c in products:
    slug=''.join(ch.lower() if ch.isalnum() else '-' for ch in name).strip('-')
    accent=colors[cat]
    # stylized premium product visual: pouch + bowl + grains
    dots=''.join(f'<circle cx="{100+(i*37)%240}" cy="{305-(i%3)*9}" r="{5+(i%4)}" fill="{c}" opacity="{0.72+(i%3)*0.08}"/>' for i in range(10))
    svg=f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 480">
<defs><linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#f7f2e7"/><stop offset="1" stop-color="#e7ddc9"/></linearGradient><linearGradient id="bag" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#172a45"/><stop offset="1" stop-color="#0b1628"/></linearGradient><filter id="sh"><feDropShadow dx="0" dy="12" stdDeviation="12" flood-opacity=".22"/></filter></defs>
<rect width="640" height="480" fill="url(#bg)"/><circle cx="530" cy="70" r="90" fill="#c9a24a" opacity=".12"/>
<path d="M185 78h270l-18 220H203z" fill="url(#bag)" filter="url(#sh)"/><path d="M205 103h230v35H205z" fill="#c9a24a"/><text x="320" y="127" text-anchor="middle" font-family="Arial" font-size="18" font-weight="700" fill="#101d32">QAVIROX</text>
<text x="320" y="185" text-anchor="middle" font-family="Georgia" font-size="27" font-weight="700" fill="#f3e7c5">{html.escape(name)}</text><text x="320" y="213" text-anchor="middle" font-family="Arial" font-size="14" fill="#d8caa7">{html.escape(local)}</text>
<text x="320" y="248" text-anchor="middle" font-family="Arial" font-size="11" letter-spacing="2" fill="#c9a24a">INDIA • EXPORT QUALITY</text>
<ellipse cx="320" cy="345" rx="205" ry="58" fill="#6c4a36" opacity=".22"/><path d="M118 326 Q320 286 522 326 L487 394 Q320 437 153 394Z" fill="#263449" filter="url(#sh)"/><ellipse cx="320" cy="326" rx="185" ry="50" fill="#eadfca"/>
<ellipse cx="320" cy="325" rx="165" ry="39" fill="{c}"/>{dots}
<text x="320" y="452" text-anchor="middle" font-family="Arial" font-size="12" font-weight="700" fill="#7b6a4a">{cat.upper()} • WHOLE / POWDER AS APPLICABLE</text></svg>'''
    Path('/mnt/data/qavirox_update/assets/catalogue',slug+'.svg').write_text(svg)

# manifest for JS
import json
Path('/mnt/data/qavirox_update/products.json').write_text(json.dumps([{'name':n,'local':l,'cat':c,'image':'assets/catalogue/'+''.join(ch.lower() if ch.isalnum() else '-' for ch in n).strip('-')+'.svg'} for n,l,c,_ in products], indent=2))
print(len(products))
