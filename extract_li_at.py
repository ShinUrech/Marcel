import sqlite3, secretstorage, hashlib, sys
from Crypto.Cipher import AES

bus = secretstorage.dbus_init()
col = secretstorage.get_default_collection(bus)
keys = [(i.get_label(), i.get_secret()) for i in col.get_all_items()]
keys.append(('peanuts', b'peanuts'))

def try_decrypt(enc_raw):
    enc = enc_raw[3:]
    for label, k in keys:
        for iters in [1, 1003]:
            dk = hashlib.pbkdf2_hmac('sha1', k, b'saltysalt', iters, dklen=16)
            cipher = AES.new(dk, AES.MODE_CBC, IV=b' '*16)
            dec = cipher.decrypt(enc)
            pad = dec[-1] if 1 <= dec[-1] <= 16 else 0
            val = (dec[:-pad] if pad else dec).decode('utf-8', errors='replace')
            if all(32 <= ord(c) < 127 for c in val) and len(val) > 20:
                return val
    return None

dbs = [
    '/home/shin/marcel/puppeteer_data/linkedin/Default/Cookies',
    '/tmp/li-cookie-profile/Default/Cookies',
    '/tmp/tmp.9ZT8dd9jbV/Default/Cookies',
]

for db in dbs:
    try:
        conn = sqlite3.connect(db)
        cur = conn.cursor()
        cur.execute("SELECT name, value, encrypted_value FROM cookies WHERE name='li_at'")
        row = cur.fetchone()
        conn.close()
        if not row:
            print(f'[{db}] no li_at row', file=sys.stderr)
            continue
        name, plain, enc = row
        if plain:
            print(f'PLAIN li_at={plain}')
        else:
            val = try_decrypt(enc)
            if val:
                print(f'li_at={val}')
                open('/tmp/li_at.txt', 'w').write(val)
            else:
                print(f'[{db}] found but cannot decrypt ({len(enc)} bytes)', file=sys.stderr)
    except Exception as e:
        print(f'[{db}] error: {e}', file=sys.stderr)
