# Triturus

Triturus artık Polygon PoS: Amoy (Testnet) üzerinde çalışan, kullanıcıların MATIC ile bağış gönderebildiği hafif bir web uygulamasıdır. Cüzdan entegrasyonu Wagmi + Viem ile yapılmıştır.

## Proje Yapısı

Proje, aşağıdaki ana bileşenlerden oluşmaktadır:

- **Frontend**: Next.js, Tailwind CSS ve TypeScript kullanılarak geliştirilmiş kullanıcı arayüzü ve cüzdan entegrasyonu (Wagmi + Viem).

### Dizin Yapısı

```
triturusv2/
└── frontend/           # Next.js frontend uygulaması
    ├── src/            # Kaynak kodları
    ├── public/         # Statik dosyalar
    └── package.json    # Frontend bağımlılıkları
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

### Ağ Bilgisi

- Network Name: Polygon Amoy Testnet
- RPC: https://rpc-amoy.polygon.technology/
- Chain ID: 80002
- Currency Symbol: MATIC
- Explorer: https://www.oklink.com/amoy

## Kullanım

- **Bağış Yapma**: Kullanıcılar, bir 0x... adresine MATIC bağışı gönderebilir.

## Katkıda Bulunma

1. Bu depoyu fork edin.
2. Yeni bir özellik dalı oluşturun (`git checkout -b feature/amazing-feature`).
3. Değişikliklerinizi commit edin (`git commit -m 'Add some amazing feature'`).
4. Dalınıza push edin (`git push origin feature/amazing-feature`).
5. Bir Pull Request açın.

## Lisans

Bu proje MIT lisansı altında lisanslanmıştır. Daha fazla bilgi için `LICENSE` dosyasına bakın. 
