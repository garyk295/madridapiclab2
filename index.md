
# Lab 2: Protecting a payments API using oAuth 2.0

## Part 1: Set up API Connect

This section can be skipped if you already have a Bluemix account and an API Connect service provisioned. If not, please follow the link below and complete ‘Lab 0 - Setup IBM API Connect’. Once complete, return to this document and move onto part 2. 

[Setup IBM API Connect Instructions](https://ibm-apiconnect.github.io/pot/lab0.html) 

## Part 2: Secure and publish API

### 2.1 Create a directory and download the loopback project from github (placeholder)

### 2.2 Exploring the ‘payments’ loopback model
1.	Run the following command to start the API Connect toolkit:

        
        apic edit
        
2.	The toolkit will open up in your web browser and request you to sign into Bluemix, please do so using your IBM ID and password. 
3.	You will observe an API already exists named ‘payments’. This uses an in memory database to store details of payments and exposes a number of operations to allow payments to be reserved and later executed. 
 
        <image 2-2-1>

4.	Click on the payments api to go into its design. 
 
        <image 2-2-2>
        
5.	Scroll down until you can see the paths of the API. You will see 2 paths have been created for you:

 a. POST / payments – this allows a payment reservation to be created and passes back a payment ID
 
 b. POST payments/{id}/execute – this executes the payment and finalises it. It accepts a payment ID as a parameter in the URL (passed back from operation a). 

        <image 2-2-3>
        
6.	Go back to the terminal and press ctrl+c to close the API Connect toolkit. Close the web browser. 


### 2.3 Creating the oAuth provider
This part of the lab will walk you through the steps required to secure the payments API using oAuth. 

a. POST / payments – this operation is secured with a client secret and ID only since it only reserves the payment (i.e. places it in a pending state). 

b. POST payments/{id}/execute – this operation is secured with oAuth 2.0 (since it’s the operation which executes the payment and finalises the financial transition). 

1.	Navigate to the ‘payment_apis’ folder on the command line or terminal
2.	Run the following command to start the API Connect toolkit:

        apic edit 
3.	Click on ‘Add’ and select ‘OAuth 2.0 Provider API’.

