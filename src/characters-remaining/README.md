# characters-remaining

Used for keeping track of the number of characters left in a textarea or input before the user reaches the maximum number of characters

### @properties
- `data-caption` - Caption to add with the counter
- `maxLength` {number} maximum number of characters allowed

### example

Wrap the `textarea` or `input` tag with a `<characters-remaining>` tag `maxlength` is a required attribute for this component

```html
<h-characters-remaining>
  <textarea id="description" name="description" required="required" maxlength="2000" placeholder="Add Package Description"></textarea>
</h-characters-remaining>
 ```
