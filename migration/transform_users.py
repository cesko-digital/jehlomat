import bcrypt
import sys

with open(sys.argv[1]) as f:
    lines = f.read().splitlines()
    transformed_lines = []
    for line in lines:
        items = line.split("\t")
        items[7] = 'NULL'
        password = bcrypt.hashpw(items[3].replace('"', '').encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
        items[3] = '"' + f'{password}' + '"'
        transformed_lines.append(items)

    with open('users_transformed.tsv', 'w') as f_t:
        for line in transformed_lines:
            f_t.write("\t".join(line) + '\n')
