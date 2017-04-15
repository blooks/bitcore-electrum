import Electrum from './index'
import { Address } from 'bitcore-lib'
import { should } from 'chai'
should()

const mpk = '92eea4d2f5263651db9e3222caded1fd4c89772f79a7c03fb6afc00e9d2c9d2ed9b86c2c95fc1171e49163079dacb7f048b3c509a27a490e1df9e7128362d468';

suite('Derivation tests', function() {
  test('should derive the correct key', function () {
    const electrum = new Electrum(mpk)
    const key0 = electrum.generatePubKey(0)
    const addr0 = Address.fromPublicKey(key0)
    addr0.as('base58').should.equal('15Ur7LV4hZFvFYQHkB12g1mdnKuHyHBDiW')
  })
})
