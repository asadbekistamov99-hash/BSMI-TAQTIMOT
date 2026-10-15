import { test } from 'node:test';
import assert from 'node:assert/strict';
import { isActionRequest, parsePriceCommand, containsSecretCode } from '../src/lib/adminChatIntent.ts';

test('narx buyruqlari turli yozilishlarda aniqlanadi', () => {
  assert.deepEqual(parsePriceCommand("semestr narxini 50000 so'm qil"), { priceUZS: 50000 });
  assert.deepEqual(parsePriceCommand('semestr narxini 50000 so’m qil'), { priceUZS: 50000 });
  assert.deepEqual(parsePriceCommand('Semestr narxini 50 000 som qiling'), { priceUZS: 50000 });
  assert.deepEqual(parsePriceCommand('narxni 50.000 uzs ga o‘zgartir'), { priceUZS: 50000 });
  assert.deepEqual(parsePriceCommand('narxini 50 ming qil qwsxazxc123'), { priceUZS: 50000 });
  assert.deepEqual(parsePriceCommand('qwsxazxc123 semestr narxini 50000 qil'), { priceUZS: 50000 });
  assert.deepEqual(parsePriceCommand('dollar narxini 5 qil'), { priceUSD: 5 });
  assert.deepEqual(parsePriceCommand('narx: 45000'), { priceUZS: 45000 });
  assert.deepEqual(parsePriceCommand('narxini 50000so‘m qil'), { priceUZS: 50000 });
  assert.deepEqual(parsePriceCommand('narxni $5 qil'), { priceUSD: 5 });
});

test('savollar va raqamsiz matnlar narx buyrug‘i emas', () => {
  assert.equal(parsePriceCommand('semestr narxi qancha?'), null);
  assert.equal(parsePriceCommand('narxni 50000 qilsam bo‘ladimi?'), null);
  assert.equal(parsePriceCommand('narxni oshir'), null);
  assert.equal(parsePriceCommand('yangi mavzu qo‘sh: 5-dars'), null);
  assert.equal(parsePriceCommand('narxni oshir qwsxazxc123'), null);
  assert.equal(parsePriceCommand('narxni 50 qil'), null);
});

test('buyruq va savol farqlanadi', () => {
  assert.equal(isActionRequest('Yurak mavzusiga video qo‘sh'), true);
  assert.equal(isActionRequest("foydalanuvchini blokla"), true);
  assert.equal(isActionRequest("to'lovni tasdiqla"), true);
  assert.equal(isActionRequest('nechta talaba bor?'), false);
  assert.equal(isActionRequest('salom'), false);
});

test('maxfiy kod joriy xabarda ham topiladi', () => {
  assert.equal(containsSecretCode(['narxni 50000 qil QWSXAZXC123'], 'qwsxazxc123'), true);
  assert.equal(containsSecretCode(['narxni 50000 qil'], 'qwsxazxc123'), false);
  assert.equal(containsSecretCode(['hech narsa'], ''), false);
});
