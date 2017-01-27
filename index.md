
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
 - a. POST / payments – this allows a payment reservation to be created and passes back a payment ID
 - b. POST payments/{id}/execute – this executes the payment and finalises it. It accepts a payment ID as a parameter in the URL (passed back from operation a). 
 
      <img src="/madridapiclab2/images/2-2-3.png" width="450">



6.Click on the 'All APIs' buton on the top left to return back to the main screen.

### 2.3 Creating the oAuth provider
This part of the lab will walk you through the steps required to secure the payments API using oAuth. 

   - a. POST / payments – this operation is secured with a client secret and ID only since it only reserves the payment (i.e. places it in a pending state). 

   - b. POST payments/{id}/execute – this operation is secured with oAuth 2.0 (since it’s the operation which executes the payment and finalises the financial transition). 


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


        ````
        Authorization URL is made up of:

        https://<bluemix host region url>/<organization-space_name>/<catalog_name>/payment-authorization/oauth2/authorize

        For example, 
                United Kingdom Bluemix URL: api.eu.apiconnect.ibmcloud.com
                Organization: gary.kean@uk.ibm.com
                Space: APIConnect
                Catalog: workshop-demo

        the Authorization URL would look like this: 
        https://api.eu.apiconnect.ibmcloud.com/garykeanukibmcom-apiconnect/workshop-demo/payment-authorization/oauth2/authorize

        Token URL is made up of:

        https://<bluemix host region url>/<organization-space_name>/<catalog_name>/payment-authorization/oauth2/token

        For example,
                United Kingdom Bluemix URL: api.eu.apiconnect.ibmcloud.com
                Organization: gary.kean@uk.ibm.com
                Space: APIConnect
                Catalog: workshop-demo

        the Token URL would look like this: 
        https://api.eu.apiconnect.ibmcloud.com/garykeanukibmcom-apiconnect/workshop-demo/payment-authorization/oauth2/token

        You can double check these URLs in the developer portal later once you have published your API.
        ````


   <img src="/madridapiclab2/images/2-4-2.png" width="450">
        
        
        
4.Scroll down to the ‘Security’ section of the API and you will see that the client ID and the client Secret are the default security measures added to each operation of the API unless configured otherwise. We therefore have to specifically add the oAuth 2.0 provider we created to the execute payment operation. Ensure the ‘Security’ section of your API matches the screen shot below.  
 
   <img src="/madridapiclab2/images/2-4-3.png" width="450">

5.Scroll down to the ‘Paths section and expand the path for ‘POST payments/{id}/execute’.

6.Ensure the security options for the API does not use the ‘API security definitions’ and instead is set to have the ‘payment approval’ oAuth  (note the client ID and client secret should also be unset). 
 
   <img src="/madridapiclab2/images/2-4-5.png" width="450">

7.Click save on the top right.

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
 
13.	You will see a message saying ‘Successfully published products’ on the top left.
 
### 2.7 Registering an app on the developer portal
1.	Go to your developer portal and sign in using your IBM ID. It may ask you to create an ‘organization’, you can name this anything you like then click ‘Submit. 
2.	Click on ‘Apps’ in the top menu bar
3.	Click on ‘Create new app’
4.	Call the app ‘madridApicOAuthApp’
5.	In the ‘OAuth Redirect URI’ field enter ‘https://example.com/redirect’
6.	Click ‘Submit’ 
7.	Click to show the client secret and client id and note these down somewhere (they will be needed later).

      <img src="/madridapiclab2/images/2-7-1.png" width="450">

### 2.8 Subscribing your oAuth application to the API
1.	Press the ‘API Products’ button in the menu bar and click on payments 
 
      <img src="/madridapiclab2/images/2-8-1.png" width="450">

2.	Click on ‘Subscribe’ and select the radio button to confirm you want to subscribe your ‘madridApicOAuthApp’ app to the Payments API product. 

      <img src="/madridapiclab2/images/2-8-2.png" width="450">

### 2.9 Calling the Payments API to reserve the payment
1.	On the left hand side, click on the payment API to expand the operations
2.	Click on the POST /payments API
3.	Scroll down until you can see the tester for this API on the right hand side
4.	In the client ID field drop down, select the ‘madridApicOAuthApp’ and enter your client secret from step 2.7.7. 
5.	In the body enter 

                {
                  "amount": 1000,
                  "beneficiary": "John Doe"
                }


      <img src="/madridapiclab2/images/2-9-1.png" width="450">

6.	Click the ‘Call Operation’ button and you should observe the response. The response will have the request payload in it plus an ID. Take note of this ID (payment_id) as it will be required later. 
 
      <img src="/madridapiclab2/images/2-9-2.png" width="450">

### 2.10 Retrieving the authorization code 
1.	On the left hand side, click on the payment authorization API to expand the operations
2.	Click on the GET /oauth2/authorize operation and you will see a URL in a section named ‘Try this operation’. Take note of this URL, it will look something like

        https://api.eu.apiconnect.ibmcloud.com/garykeanukibmcom-apiconnect/lab/payment-authorization/oauth2/authorize




      <img src="/madridapiclab2/images/2-10-1.png" width="450">
        
        
3.	You will call the URL you took note of via a web browser, however we must append some parameters to it in order to properly authenticate and get the access token. We must add

        - response_type=code
        - scope=payment_approval
        - payment_id= see step 2.9.6
        - client_id= see step 2.7.7
        - redirect_uri=https://example.com/redirect

Here is an example:
        
        https://api.eu.apiconnect.ibmcloud.com/garykeanukibmcom-apiconnect/workshop-demo/payment-authorization/oauth2/authorize?response_type=code&scope=payment_approval&payment_id=999&client_id=dcebcce4-91ae-4af4-9c14-c812e1677937&redirect_uri=https://example.com/redirect
        
        
4.Now call you constructed in the previous step from your web browser (just like you were visiting http://ibm.com). You will be redirected to the external authorization and authentications login page 
5.Enter 

- username=johndoe 

- password=password 

then click login
 

   <img src="/madridapiclab2/images/2-10-2.png" width="450">


6.Click ‘approve payment’
 
   <img src="/madridapiclab2/images/2-10-3.png" width="450">

7.You will be redirected to ‘example.com/redirect’. Appended to the URL there will be the authorization code you require to obtain the access token in the next step. Copy this code and keep note of it. 

The authorization code from below is: AAKm5rxLqxTqUNAnqRQIfg4raNxLxGiI4SWNvIfczRNGFjxm9658XEzcNg25ErFYROEp5OL9Z46EKVi_HLuzHmDiQnT9BoNQ6cAWue9atl2gHQ

        https://example.com/redirect?code=AAKm5rxLqxTqUNAnqRQIfg4raNxLxGiI4SWNvIfczRNGFjxm9658XEzcNg25ErFYROEp5OL9Z46EKVi_HLuzHmDiQnT9BoNQ6cAWue9atl2gHQ

  <img src="/madridapiclab2/images/2-10-4.png" width="450">

### 2.11 Retrieving the access token 

1.	Return back to the developer portal in your web browser and go back to the payments API product.

2.	Expand the payment authorization API and select the POST /oauth2/token operation 

3.	On the right hand side you will see a URL in a section named ‘Try this operation’. Take note of this URL, it will look something like

        https://api.eu.apiconnect.ibmcloud.com/garykeanukibmcom-apiconnect/lab/payment-authorization/oauth2/token

4.	We will use a ‘curl’ command on the command line/terminal to get the access token from the authorization code. Therefore, open up a new command line/terminal session. 

5.	Before we can call the command to get the access token, we need to add a few parameters to the command. We must add:

        - Client ID= see step 2.7.7
        - Client Secret =see step 2.7.7
        - grant_type=authorization_code
        - redirect_uri=https://example.com/redirect
        - code= see step 2.10.7

The structure is:

          curl -v -k -u <client id>:<client secret> -X POST -d 'grant_type=authorization_code&redirect_uri=https://example.com/redirect&code=< authorization code>’ '<token url>’

For example:
       
         curl -v -k -u 577a3933-7f20-457e-b6af-f0ce3ee5cddc:I1cC4yU7lX2tH2xM2uT3bB3gW7bE5tN7vJ8dG0nN7xX8wI3tW2 -X POST -d 'grant_type=authorization_code&redirect_uri=https://example.com/redirect&code= AAKm5rxLqxTqUNAnqRQIfg4raNxLxGiI4SWNvIfczRNGFjxm9658XEzcNg25ErFYROEp5OL9Z46EKVi_HLuzHmDiQnT9BoNQ6cAWue9atl2gHQ’  'https://api.eu.apiconnect.ibmcloud.com/garykeanukibmcom-apiconnect/lab/payment-authorization/oauth2/token'

Ensure the spaces between the different parts of the command are correct.




6.	Run the command you constructed in the previous step on the command line/terminal. The response should look like below. Take a note of the access token in the response. 


        { "token_type":"bearer", "access_token":"AAEkNTc3YTM5MzMtN2YyMC00NTdlLWI2YWYtZjBjZTNlZTVjZGRjqROf_74P_zTkHshgnZPpiIbWN6_JJyS9MzxPlkD17aRufXpdyaj4D3fgkla-JTRq7UV69n97wpjV0l9odtJeuYYRReX--UhPcyRZXVOVxnU", "expires_in":3600, "scope":"payment_approval" }
        
        
### 2.12 Executing the payment using the access token 
1.	Return back to the developer portal in your web browser and go back to the payments API product.
2.	Expand the payments API and select the POST /payments/{id}/execute operation.
    
      <img src="/madridapiclab2/images/2-12-1.png" width="450">
        
3.	Scroll down until you can see the ‘Identification’ section. Select you app name from the ‘Client ID’ drop down and enter your client secret (See step 2.7.7).
 
      <img src="/madridapiclab2/images/2-12-2.png" width="450">
 
4.	Scroll down until you can see the ‘Authorization’ section in the tester on the right hand side. Enter your access token (see step 2.11.6). 

5.	Scroll further down and enter the payment id you are executing in the id field (see step 2.9.6)

      <img src="/madridapiclab2/images/2-12-3.png" width="450">
        
6.	Click ‘Call Operation’ to execute the call. The response should be the payment_id you specified now with an ‘executed’ state. 

            
            {
            "amount": 1000,
            "beneficiary": "John Doe",
            "state": "executed",
            "id": 5
            }


Congratulations, you have successfully  configured the payments API to use oAuth 2.0. 
