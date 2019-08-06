 # accordion-slider

Used for hiding or showing content

 - <section> is the accordion section
 - [data-group] is allowed on sections
 - Nested sections are allowed.
 - <header> is the section to click on for the accordion
 - Add the class 'expanded' to have the section expanded
 - <summary> is the data that will hide and show

### example

```html
<accordion-slider>
  <section data-group="main">
    <header class="accordion-header expanded">
      Show Details
    </header>
    <summary>
      <div class="details-table" data-automation-id="table-data">
        Inserting data will allow the MutationObserver to pick up the
        dom changes and adjust the height
      </div>
    </summary>
  </section>
</accordion-slider>
```
