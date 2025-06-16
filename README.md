# Triturus

Triturus, Sui blockchain üzerinde çalışan, kullanıcıların @tri isimleri alarak bağış toplayabildiği bir platformdur. Sui cüzdan entegrasyonu ile donatılmıştır.

## Proje Yapısı

Proje, aşağıdaki ana bileşenlerden oluşmaktadır:

- **Frontend**: Next.js, Tailwind CSS ve TypeScript kullanılarak geliştirilmiş, kullanıcı arayüzü ve cüzdan entegrasyonu.
- **Sui Contract**: Move dilinde yazılmış, kullanıcı adı kaydı ve bağış işlemlerini yöneten akıllı kontrat.

### Dizin Yapısı

```
triturusv2/
├── frontend/           # Next.js frontend uygulaması
│   ├── src/            # Kaynak kodları
│   ├── public/         # Statik dosyalar
│   └── package.json    # Frontend bağımlılıkları
└── sui-contract/       # Sui Move kontratı
    └── donation/       # Donation modülü
        ├── sources/    # Move kaynak dosyaları
        └── Move.toml   # Move yapılandırması
```

## Kurulum

### Frontend

1. Frontend dizinine gidin:
   ```bash
   cd frontend
   ```

2. Bağımlılıkları yükleyin:
   ```bash
   npm install
   ```

3. Geliştirme sunucusunu başlatın:
   ```bash
   npm run dev
   ```

### Sui Contract

1. Sui contract dizinine gidin:
   ```bash
   cd sui-contract/donation
   ```

2. Move modülünü derleyin:
   ```bash
   sui move build
   ```

3. Modülü deploy edin:
   ```bash
   sui client publish --gas-budget 100000000
   ```

## Kullanım

- **Kullanıcı Adı Kaydı**: Kullanıcılar, @tri isimlerini kaydederek bağış alabilirler.
- **Bağış Yapma**: Kullanıcılar, kayıtlı @tri isimlerine bağış yapabilirler.

## Katkıda Bulunma

1. Bu depoyu fork edin.
2. Yeni bir özellik dalı oluşturun (`git checkout -b feature/amazing-feature`).
3. Değişikliklerinizi commit edin (`git commit -m 'Add some amazing feature'`).
4. Dalınıza push edin (`git push origin feature/amazing-feature`).
5. Bir Pull Request açın.

## Lisans

Bu proje MIT lisansı altında lisanslanmıştır. Daha fazla bilgi için `LICENSE` dosyasına bakın. 
