import bitcore, { PublicKey } from 'bitcore-lib'
const {
  crypto: {
    BN: bignum,
    Point,
    Hash: {
      sha256sha256: twoSha256
    }
  }
} = bitcore

/**
 * Pre-BIP32 Electrum public key derivation (electrum <2.0)
 *
 * For now, this class can only understands master public keys.
 * It doesn't support derivation from a private master key (TODO).
 *
 * @example examples/ElectrumMPK.js
 */

class Electrum {
  constructor (masterPublicKey) {
    this.mpk = new Buffer(masterPublicKey, 'hex')
  }

  getSequence ({ change = false, index }) {
    const mode = change ? 1 : 0
    const buf = Buffer.concat([ new Buffer(index + ':' + mode + ':', 'utf8'), this.mpk ])
    return bignum.fromBuffer(twoSha256(buf))
  }

  generatePubKey ({index, change}) {
    const x = bignum.fromBuffer(this.mpk.slice(0, 32), {
      size: 32
    })
    const y = bignum.fromBuffer(this.mpk.slice(32, 64), {
      size: 32
    })
    const masterPublicKeyPoint = new Point(x, y)
    const sequence = this.getSequence({change, index})
    const sequenceKey = new PublicKey()
    sequenceKey.private = sequence.toBuffer()
    sequenceKey.regenerateSync()
    sequenceKey.compressed = false

    const sequencePoint = Point.fromUncompressedPubKey(sequenceKey.public)
    const pt = Point.add(masterPublicKeyPoint, sequencePoint)

    const xbuf = pt.x.toBuffer({
      size: 32
    })
    const ybuf = pt.y.toBuffer({
      size: 32
    })
    const prefix = new Buffer([ 0x04 ])

    const key = new Key()
    key.compressed = false
    key.public = Buffer.concat([ prefix, xbuf, ybuf ])

    return key.public
  }
  generateChangePubKey (sequence) {
    return this.generatePubKey(sequence, true)
  }
}

export default Electrum
