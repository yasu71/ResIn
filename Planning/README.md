# User Stories

- As a user , I want to be able to save an external URL along with a title and description, because I will want to reference it at a later date.

- As a user, I want to be able to search through already saved resources available and created by other users, because I was to broaden my knowledge further.

- As a user, I want to organise my resources under specific topics, because it will enable me to find information more efficiently.

 - As a user, I want to be able to provide input and opiions on resources, so that I can share my experience and knowledge.

  - As a user, I want to be able to provide the resources with a rating and a like, to show other users that this resource is useful.

  - As a user, I want to have a single webpage which shows all my resources and my favourite resources, so that I have all this available in one place.

  - As a user, i want to be able to register an account and navigate through my account effectively withou any issues.

  # User Scenarios

  -  Given that I am logged in, when I click on 'My Resources', then I would want to be able to see all my liked resources as well as my own generated resources.

  -  When logged in, when clicking on a 'Add Resource' button, I want to be redirected to a form where I can input a URL and include a title and description.

  - When logged in, I would like a search field, where I can add text to search for a particular resource created by other users.

  - When logged in, when click a 'Create Category' button, I want there to be an option to either drag and drop the resource into that category or a tick box option to select which category to add the resource to, under a specific topic.

  - As a user, I want to be able to share my opinion and input on resource material, incase there a new updates or if I want to praise the resource creator. I would also like to be able to have a quick rating or like feature for each resource.

  - I want the option of leaving comments and adding resources to be only available to registered users. Although non-users can view the resources, they should not be allowed to add comments or add resources without making an account, however they can still rate and like the resources.

  - Given that I am logged in, I should be able to update my profile upon a click of a button. (STETCH)


  # User Experience

  1. Non-user/ Users home page will show the most uploaded resources

  2.  Upon Login, we want the user to be directed to their 'My Resources Page'

    - Upon login, we want the user to remain in the same page (STRETCH)

  3. In nav bar, have a search field with a dropdown list of categories, which searched keywords and returns resource results.

  4. A 'Add Resource' page or a 'Pop Up' to add new resources with URL, Title and Description

  5. Implementing the comment, like and rating features to each resource.

  6. Implementing the categories in the Home Page for users only

  7. Making resources option available to either 'Everyone' OR 'Just Users' (STRETCH)
 
  # Pages Required

  - Home Page
    - Resource card will expand upon click
  - My Resources
    - Resource card will expand upon click
  - Search Results Page
    - 5-6 Resources listed
    - 1 resource will be added in addition to existing resources during demo
  - Create Resource Page (potentially a popup)
  - Categories Page

# Best Case Scenario

I visit the page and I am welcomed by a home page showing available resources. I do not have a user account, so I click on the register button and create an account, which redirects me to the My Resources page. I want to find a particular resource on web development, so I type web development into the search bar and click the search button. This directs me to a new page full of resources on web development that I can sift through to find the resource that I am looking for. Once found I will click into the resource and the resource card will expand to show the title and description.

# Routes 

### Users - (Potential STRETCH)
- Register User - GET, POST ('/register')
- User Login - GET, POST ('/login)
- Update Profile - GET, POST ('/profile/:userid/edit')
- Logout - POST ('/logout') - redirect to homepage

### Resources 
- My Resources page - GET ('/resources')
[X] My Resources page - GET, POST ('/resources/:userid')

### Resource Rating
- Comment - GET, POST ('/resource/:resid')
- Ratings - GET, POST ('/resource/:resid')
- Like - GET, POST ('/resource/:resid')

### Search Resource
- Non-user Search Submit - GET, POST ('/resources/browse)
- User Search Submit - GET, POST ('/resources/:userid/browse)

### Add Resource
[X] Add Resource - GET, POST ('/resources/:userid')
- Delete - POST ('/resource/:resid/delete') - STRETCH

### Categories
- Add categories - GET, POST ('/resources/:userid/')
