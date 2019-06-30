# table-sort

Table sorting using javascript
 
### example
 ```html
// Wrap the table with a <table-sort> tag
<table-sort>
    <table>
        <thead></thead>
        <tbody></tbody>
    </table>
</table-sort>
```
```js
const tableSort = document.querySelector('table-sort')
const firstTHCells = [...tableSort.$tableTHCells].shift()
tableSort.columnSort(firstTHCells, true)
```
