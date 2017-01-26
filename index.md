
# Lab 2: Protecting a payments API using oAuth 2.0

## Part 1: Set up API Connect

This section can be skipped if you already have a Bluemix account and an API Connect service provisioned. If not, please follow the link below and complete ‘Lab 0 - Setup IBM API Connect’. Once complete, return to this document and move onto part 2. 

[Setup IBM API Connect Instructions](https://ibm-apiconnect.github.io/pot/lab0.html) 

## Part 2: Secure and publish API

### 2.1 Create a directory and clone the API Connect project from github

1.	Navigate to a root folder on your laptop where you would like to keep your apic project
2.	Run the following command to create a directory

        mkdir madridApic
                        
3.	Change to the directory you just created by running the following command

        cd madridApic
                       
4.  Clone the API Connect project from github by running the following command

         git clone https://github.com/garyk295/madridapiclab2code


5.	Change to the directory you just created by running the following command

         cd madridapiclab2code

6.	Run the following command to install the required NPM dependencies

          npm install 

### 2.2 Exploring the ‘payments’ loopback model
1.	Run the following command to start the API Connect toolkit:

        
        apic edit
        
2.	The toolkit will open up in your web browser and request you to sign into Bluemix, please do so using your IBM ID and password. 
3.	You will observe an API already exists named ‘payments’. This uses an in memory database to store details of payments and exposes a number of operations to allow payments to be reserved and later executed. 
 
      <img src="/madridapiclab2/images/2-2-1.png" width="450">

4.	Click on the payments api to go into its design. 
 
      <img src="/madridapiclab2/images/2-2-2.png" width="450">
        
5.	Scroll down until you can see the paths of the API. You will see 2 paths have been created for you:

 a. POST / payments – this allows a payment reservation to be created and passes back a payment ID
 
 b. POST payments/{id}/execute – this executes the payment and finalises it. It accepts a payment ID as a parameter in the URL (passed back from operation a). 
 

   <img src="/madridapiclab2/images/2-2-3.png" width="450">
        
6.	Click on the 'All APIs' buton on the top left to return back to the main screen.

### 2.3 Creating the oAuth provider
This part of the lab will walk you through the steps required to secure the payments API using oAuth. 

a. POST / payments – this operation is secured with a client secret and ID only since it only reserves the payment (i.e. places it in a pending state). 

b. POST payments/{id}/execute – this operation is secured with oAuth 2.0 (since it’s the operation which executes the payment and finalises the financial transition). 


1.	Click on ‘Add’ and select ‘OAuth 2.0 Provider API’.

     <img src="/madridapiclab2/images/2-3-1.png" width="450">
        
2.	Name the oAuth API ‘payment authorization’ and select ‘Create API’.
 
     <img src="/madridapiclab2/images/2-3-2.png" width="450">
        
3.	Scroll down to the oAuth 2 section and set:

        - Client Type: Confidential 
        - Scope Name: payment_approval (delete the other 2 scopes)
        - Grants: Check only ‘Access Code’, uncheck the others
        - Identify Extraction: Redirect
        - Redirect URL: https://aaservergk.eu-gb.mybluemix.net/login
        - Authentication URL: https://thinkibm-services.mybluemix.net/auth
        - TLS Profile: leave blank
        - Authorize application user using: Authenticated
        - Time to live: 3597
        - Switch off ‘Enable Refresh Tokens’, ‘Enable Revocation’ and ‘Enable Token Introspection’. 
        - Leave Metadata URL and TLS profile blank. 

      <img src="/madridapiclab2/images/2-3-4.png" width="450">


4.	Click save on the top right.
5.	Scroll down until you see the section to declare parameters.
6.	Click the plus icon to create a new parameter, set:

        - Name: payment_id
        - Located in: Query
        - Required: yes (tick)
        - Type: String
 
      <img src="/madridapiclab2/images/2-3-5.png" width="450">

7.	Click save on the top right.
8.	Scroll to the ‘paths’ section of the API. 
9.	Expand the GET /oauth2/authorize
10.	Click ‘Add Parameter’ and select ‘payment_id’.

      <img src="/madridapiclab2/images/2-3-6.png" width="450">
           
11.	Click save on the top right.

### 2.4 Securing the Payments API with the oAuth provider
1.	Press ‘All APIs’ at the top to return to the list of APIs
2.	Click on the payments API to go in and see the details. 
 
     <img src="/madridapiclab2/images/2-4-1.png" width="450">

3.	Scroll down to the ‘Security Definitions’ section and click the + icon to create a new security definition. Select oAuth, then set:

        - Name: payment approval
        - Flow: Access Code
        - Authorization URL: see below
        - Token URL: see below
        - Add a scope using the (+), scope name: payment_approval

Authorization URL is made up of:

https://<bluemix host region url>/<organization-space_name>/<catalog_name>/payment-authorization/oauth2/authorize

For example, for:
United Kingdom Bluemix URL: api.eu.apiconnect.ibmcloud.com
Organization: gary.kean@uk.ibm.com
Space: APIConnect
Catalog: workshop-demo

the Authorization URL would look like this: 
https://api.eu.apiconnect.ibmcloud.com/garykeanukibmcom-apiconnect/workshop-demo/payment-authorization/oauth2/authorize

Token URL is made up of:

https://<bluemix host region url>/<organization-space_name>/<catalog_name>/payment-authorization/oauth2/token

For example, for:
United Kingdom Bluemix URL: api.eu.apiconnect.ibmcloud.com
Organization: gary.kean@uk.ibm.com
Space: APIConnect
Catalog: workshop-demo

the Token URL would look like this: 
https://api.eu.apiconnect.ibmcloud.com/garykeanukibmcom-apiconnect/workshop-demo/payment-authorization/oauth2/token

You can double check these URLs in the developer portal later once you have published your API.


      <img src="/madridapiclab2/images/2-4-2.png" width="450">
        
 4.	Scroll down to the ‘Security’ section of the API and you will see that the client ID and the client Secret are the default security measures added to each operation of the API unless configured otherwise. We therefore have to specifically add the oAuth 2.0 provider we created to the execute payment operation. Ensure the ‘Security’ section of your API matches the screen shot below.  
 
      <img src="/madridapiclab2/images/2-4-3.png" width="450">

5.	Scroll down to the ‘Paths section and expand the path for ‘POST payments/{id}/execute’.
6.	Ensure the security options for the API does not use the ‘API security definitions’ and instead is set to have the ‘payment approval’ oAuth  (note the client ID and client secret should also be unset). 
 
      <img src="/madridapiclab2/images/2-4-5.png" width="450">

7.	Click save on the top right.

### 2.5 Adding the oAuth provider to the product
1.	Press ‘All APIs’ at the top to return to the list of APIs.
2.	Click on products.
3.	Click on the ‘Payments’ product to see the details.
4.	Scroll down to the APIs section and press the (+) button. Check the ‘payment authorization’ API then press 'apply' to add it to the product.

      <img src="/madridapiclab2/images/2-5-1.png" width="450">


      <img src="/madridapiclab2/images/2-5-2.png" width="450">

5.	Click on save on the top right. 

### 2.6 Publish product to Bluemix
1.	Hit ‘Publish’ on the top right of the API Connect toolkit
2.	Click ‘Add and Manage Targets’
3.	Select ‘Add IBM Bluemix Target’.

      <img src="/madridapiclab2/images/2-6-1.png" width="450">
      
4.	You should already be signed into Bluemix.
5.	Select the region and space where you previously created your own API Connect instance. Speak to your instructor if you have not yet done this. 
6.	Select the catalog you would like to use (the recommendation is to use sandbox) and click 'next'.
 
      <img src="/madridapiclab2/images/2-6-2.png" width="450">
        
7.	On the screen to select the Bluemix application, type a new application name in at the bottom of the screen (e.g. madridApicLab) then press the + to add the application. Then click save. 

      <img src="/madridapiclab2/images/2-6-3.png" width="450">
        
8.	You are returned back to the main API Connect toolkit page. Select the ‘Publish’ button on the top right again. Select the Bluemix target you just set up.

9.	Check the ‘Publish Application’ only and hit ‘Publish’.

      <img src="/madridapiclab2/images/2-6-4.png" width="450">

10.	Once published, you will see a ‘Successfully published application’ message. 

      <img src="/madridapiclab2/images/2-6-5.png" width="450">


11.	Select the ‘Publish’ button on the top right again. Select the Bluemix target you set up.

12.	Select ‘Stage or Publish products’, then ‘Select specific products’ and choose the ‘payments’ product. 

      <img src="/madridapiclab2/images/2-6-6.png" width="450">
