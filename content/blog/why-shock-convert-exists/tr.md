---
title: "Sağ tıkla dönüştür: Shock Convert neden var"
date: 2026-11-15
kind: article
summary: "Sadece JPEG kabul eden bir e-ticaret paneli, her gün tekrarlanan bir angarya ve sonunda yazdığım küçük Windows aracı."
---

Bir süre bir e-ticaret işinin ürün tarafını yönettim. Kullandığımız sistem görsel olarak sadece JPEG kabul ediyordu. İndirdiğim görsellerin çoğu ise PNG ya da WebP geliyordu, yani her seferinde önce dönüştürmem gerekiyordu.

Tek bir görsel için sorun değil. Ama bu iş her gün tekrarlanınca süreç uzuyordu: bir program aç, dosyayı seç, formatı seç, kaydet. Çevrimiçi dönüştürücüler daha hızlıydı ama dosyaları internete yüklemek istemiyordum.

Aklımdaki şey zip dosyalarıyla uğraşmak kadar basitti: dosyaya sağ tıkla, formatı seç, bitti.

## Ortaya çıkan araç

Shock Convert tam olarak bunu yapıyor. Windows'ta Dosya Gezgini'nin sağ tık menüsüne yerleşiyor; PNG, JPG, WebP, BMP, GIF, TIFF ve ICO arasında dönüştürüyor. Dosyalar bilgisayardan çıkmıyor.

Rust ile yazdım. Çekirdek kütüphane ve komut satırı aracı ayrı parçalar, birden fazla dosyayı paralel dönüştürüyor ve kurulum için yönetici izni istemiyor.

Kendi işimde kullanmaya başladığımda sonucu doğrudan almak çok hoşuma gitti. Bir ihtiyacı kendin yaşayıp kendin çözmenin tadı başka.

## Sırada ne var

Aklımda eklemek istediğim başka özellikler var. Henüz başlamadım, şimdilik sadece fikir.

Aracı [shockconvert.suleymankara.com](https://shockconvert.suleymankara.com) adresinden indirebilir, koduna [GitHub](https://github.com/suleyman-kara/shock-convert)'dan bakabilirsin.
