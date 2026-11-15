---
title: Markdown örneği
date: 2026-11-15
kind: article
summary: Blogun desteklediği tüm Markdown özelliklerini kullanan bir stil test sayfası. Gerçek bir yazı değil.
cover: /og.jpg
tags: [örnek, markdown]
draft: true
---

Bu taslak, yazı stilini iki temada da kontrol etmek için var. `draft: true` olduğu sürece yayımlanmaz. Paragraflarda **kalın yazı**, *italik yazı*, ~~üstü çizili~~, `satır içi kod` ve [projeler sayfasına bir bağlantı](/tr/projects/) ile [dış bağlantı](https://github.com/suleyman-kara) bulunur.

## İkinci düzey başlık

İkinci düzey başlığın altında, satır yüksekliğinin görülebilmesi için çoğu genişlikte ikinci satıra taşacak uzunlukta kısa bir paragraf.

### Üçüncü düzey başlık

- Sırasız liste öğesi
- İçinde `kod` olan bir öğe
  - İç içe öğe
  - İkinci iç içe öğe
- Son öğe

1. Birinci sıralı öğe
2. İkinci sıralı öğe
3. Üçüncü sıralı öğe

- [x] Tamamlanmış görev
- [ ] Açık görev

> Bir alıntı bloğu. **Kalın** yazı içerebilir ve metin yeterince uzunsa birden fazla satıra yayılır.

![Sitenin varsayılan paylaşım görseli](/og.jpg)

| Özellik | Destek | Not |
| :------ | :----: | --: |
| Tablolar | Evet | hizalı sütunlar |
| Kod blokları | Evet | renklendirilmiş |
| Görseller | Evet | `public/` klasöründen |

```ts
// Sözdizimi renklendirmeli TypeScript
type Kind = 'article' | 'note' | 'video';

export function label(kind: Kind): string {
  return kind === 'article' ? 'Yazı' : kind === 'note' ? 'Not' : 'Video';
}
```

```python
def mape(actual, predicted):
    pairs = [(a, p) for a, p in zip(actual, predicted) if a != 0]
    return sum(abs((a - p) / a) for a, p in pairs) / len(pairs)
```

```
Dil belirtilmemiş düz kod bloğu.
```

---

#### Dördüncü düzey başlık

Örneğin sonu.
