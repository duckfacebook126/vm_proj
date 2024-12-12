const taskRouter= require('./taskRouter');

module.exports=taskRouter;

/**
 * @fileOverview This is the main router file which exports all the routes of the application.
 * @description The routes are defined in the taskRouter.js file.
 * @workflow
 * 1. The taskRouter.js file exports all the routes.
 * 2. The routes are defined using the express.Router() function.
 * 3. The routes are exported from the taskRouter.js file.
 * 4. The index.js file imports the taskRouter.js file.
 * 5. The index.js file exports the taskRouter.js file.
 * 6. The app.js file imports the index.js file.
 * 7. The app.js file uses the routes exported by the index.js file.
 */
