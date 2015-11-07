# dacas-cql-builder
** Yet another CQL builder :smile_cat:**

I just need one for my [dacas](https://github.com/tutukin/dacas) Object-Table mapper for Cassandra. This is a simple builder for CQL queries:

```javascript
const CQL = require(dacas-cql-builder);

var q = CQL
    .select()
    .from('keyspace', 'table');

console.log(q.toString());
// -> 'SELECT * FROM keyspace.table'

q = CQL.insert({a:'aaa', b:'bbb'}).into('ks', 'tbl');
console.log(q.toString());
// -> "INSERT INTO ks.tbl (a, b) VALUES ('aaa', 'bbb')"
```
## API

… The rest of API is coming soon!
