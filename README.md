# react-to-do-list
A front-end-only to-do list in React with API calls to https://jsonplaceholder.typicode.com/ to fake a backend.

This is hosted on Heroku [here](https://floating-harbor-80134.herokuapp.com/).

---

## Requirements
###### *To-do list for the to-do list*


- [x] Load data from https://jsonplaceholder.typicode.com/
- [x] Sortable ascending and descending
- [x] String searchable
- [x] Clicking on a row should open into a new page with all the details
- [x] Closing the page should take user back to the list view
- [x] Visually able to mark tasks complete
- [x] Infinite scroll (new assets load as the user scrolls) or paged list
- [x] Looks real good

### Notes
- I made another last minute change to how sorting is done, opting to pull the "todos" from the cached set instead of the display set only when sorting by "doneness". The downside, is the loss of the ability to sort alphabetically and *then* by doneness, but that caused an issue with the todos list flipping itself around since I was sorting by doneness and not also checking against an item id to maintain integrity. **By pulling from the cache before doing a doneness sort, the user gets an easy to understand reponse, likely affirming how they expect the app to behave when they clicked the sort button.**