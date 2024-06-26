<!-- Improved compatibility of back to top link: See: https://github.com/othneildrew/Best-README-Template/pull/73 -->
<a name="readme-top"></a>
<!--
*** Thanks for checking out the Best-README-Template. If you have a suggestion
*** that would make this better, please fork the repo and create a pull request
*** or simply open an issue with the tag "enhancement".
*** Don't forget to give the project a star!
*** Thanks again! Now go create something AMAZING! :D
-->



<!-- PROJECT SHIELDS -->
<!--
*** I'm using markdown "reference style" links for readability.
*** Reference links are enclosed in brackets [ ] instead of parentheses ( ).
*** See the bottom of this document for the declaration of the reference variables
*** for contributors-url, forks-url, etc. This is an optional, concise syntax you may use.
*** https://www.markdownguide.org/basic-syntax/#reference-style-links
-->
[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]
[![LinkedIn][linkedin-shield]][linkedin-url]



<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/othneildrew/Best-README-Template">
    <img src="frontend\src\components\Logo1-removebg.png" alt="Logo" width="auto" height="80">
  </a>

  <h3 align="center">Assets, Inventory and Logistic Management System</h3>
  <p align="center">
    Efficiency Unleashed: Streamline Your Assets, Inventory, and Logistics with Ease!
    <br />
    <a href="https://github.com/othneildrew/Best-README-Template">View Demo</a>
    ·
<!--     <a href="https://github.com/othneildrew/Best-README-Template/issues/new?labels=bug&template=bug-report---.md">Report Bug</a> -->
    <a href="https://github.com/Ruthvik283/AILMS_IITI/issues/new?title=Bug%20report%20%F0%9F%90%9E&body=%23%23%20Describe%20the%20bug%0AA%20clear%20and%20concise%20description%20of%20what%20the%20bug%20is.%0A%0A%23%23%23%20Steps%20to%20reproduce%0ASteps%20to%20reproduce%20the%20behavior.%0A%0A%23%23%23%20Expected%20behavior%0AA%20clear%20and%20concise%20description%20of%20what%20you%20expected%20to%20happen.%0A%0A%23%23%23%20Environment%0A%20-%20OS%3A%20%5Be.g.%20Arch%20Linux%5D%0A%20-%20Other%20details%20that%20you%20think%20may%20affect.%0A%0A%23%23%23%20Additional%20context%0AAdd%20any%20other%20context%20about%20the%20problem%20here.&labels=bug">Report Bug</a>
    ·
    <a href="https://github.com/Ruthvik283/AILMS_IITI/issues/new?title=Feature%20request%20%F0%9F%8E%AF&body=%23%23%20Summary%0ABrief%20explanation%20of%20the%20feature.%0A%0A%23%23%23%20Basic%20example%0AInclude%20a%20basic%20example%20or%20links%20here.%0A%0A%23%23%23%20Motivation%0AWhy%20are%20we%20doing%20this%3F%20What%20use%20cases%20does%20it%20support%3F%20What%20is%20the%20expected%20outcome%3F%0A%0A&labels=feature%20request">Request Feature</a>
  </p>
</div>




# Project Title

AILMS - Assets, Inventory and Logistic Management System

## Description





* Introducing an integrated Asset, Inventory, and Logistic Management System
* Designed to streamline all operational processes into a unified software platform
* Serves as a vital link connecting technicians, associated engineers, and managers
* Offers a user-friendly interface with robust functionalities
* Manages warehouse materials and facilitates the sanctioning of materials requested by technicians, subject to approval by associated engineers
* Tracks purchases made from vendors, ensuring full transparency and accountability throughout the procurement process
* Includes comprehensive report generation capabilities for in-depth analysis of budgets
## Motivation

In our college, specifically at Indore, there was a notable absence of a comprehensive system to track essential processes like asset and inventory management. This gap led to numerous loopholes and a lack of transparency in our operations. Everything relied heavily on manual registers, leaving ample room for error and the potential for material leakage. Additionally, without proper tracking mechanisms in place, analyzing material usage was virtually impossible. Recognizing these challenges, the concept for a software solution was born, aimed at fulfilling all these critical needs and revolutionizing our management processes.



## Tech/Framework used



* [![React][React.js]][React-url]
* [![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-131F3E?style=for-the-badge&logo=tailwind-css&logoColor=38B2AC)](https://tailwindcss.com/)
* [![Django Rest Framework](https://img.shields.io/badge/Django_Rest_Framework-a40101?style=for-the-badge&logo=django&logoColor=white)](https://www.django-rest-framework.org/)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Getting Started

### Prerequisites

Before you begin, ensure you have met the following requirements:
- Python 3.6 or higher installed on your machine.
- pip package manager.
- Node.js and npm installed to manage frontend dependencies.
- Git to clone the repository (optional).

### Installation

1. Clone the repository to your local machine:
    ```sh
    git clone https://github.com/Ruthvik283/AILMS_IITI.git
    ```

2. Navigate into the project directory:
    ```sh
    cd AILMS_IITI
    ```

3. Navigate into the backend directory and install Python dependencies using pip and the provided `requirements.txt` file:
    ```sh
    cd backend
    pip install -r requirements.txt
    ```

4. Return to the project root directory, navigate into the frontend directory and install frontend dependencies using npm:
    ```sh
    cd ..
    cd frontend
    npm install
    ```

5. Return to the project root directory:
    ```sh
    cd ..
    ```



### Configuration

1. Copy the `.env.example` file in the backend directory to `.env` and configure the environment variables according to your setup:
    ```sh
    cp backend/.env.example backend/.env
    ```

2. Configure your Django settings in `backend/settings.py`, including database settings, secret key, etc.

### Running the Application

1. In one terminal, navigate into the backend directory and run Django migrations to create necessary database tables:
    ```sh
    cd backend
    python manage.py migrate
    ```

2. Start the Django development server:
    ```sh
    python manage.py runserver
    ```

3. In a separate terminal, navigate into the frontend directory and start the React development server:
    ```sh
    cd frontend
    npm start
    ```

4. Visit `http://localhost:3000` in your browser to view the application.



<p align="right">(<a href="#readme-top">back to top</a>)</p>


## How to Use?


<div align="center">
    <img src="readmeImg\Home page.jpeg" alt="Logo" width="700px" height="auto">
  
</div>



#### 1. View the materials table

* It is possible for Manager to access and examine the inventory housed within the warehouse.
* They can search for inventory to check its contents and respective quantities.


<div align="center">
    <img src="readmeImg\materialsList.png" alt="Logo" width="700px" height="auto">

</div>

* If any materials is found to have fallen below their predetermined critical threshold, an email notification can be sent to the designated personnel, apprising them of the shortage within the warehouse.

<div align="center">
    <img src="readmeImg\critalQuantity.png" alt="Logo" width="700px" height="auto">

</div>

* The materials are organized into various categories, and users can add new materials within a specific category. The materials page also displays the path to each category, providing clear navigation for users.

<div align="center">
    <img src="readmeImg\addMaterial.jpg" alt="Logo" width="700px" height="auto">

</div>

<br></br>


#### 2. Sanction and Purchases Table

* The manager has the capability to view and add entries to the sanction table, where they can check detailed descriptions of sanctions, including ticket ID, sanctioned materials, assigned technician, engineer authorizing the materials, status, etc. Filtering options are available for refining searches based on these fields.


<div align="center">
    <img src="readmeImg\Sanctiontable.png" alt="Logo" width="700px" height="auto">

</div>

* Moreover, a particular sanction can be modified, and we can obtain a Sanction log for the same. 
<div align="center">
    <img src="readmeImg\modifySanction.png" alt="Logo" width="700px" height="auto">

</div>

*There is an option on the sanction page to create new sanctions, which can be used to sanction materials to technicians, leading to a corresponding decrement in the inventory once sanctioned.

* Likewise, the manager can access the purchase table to inspect specific purchases and view associated invoice PDFs, along with comprehensive details pertaining to each purchase transaction.
<div align="center">
    <img src="readmeImg\PurchaseTable.png" alt="Logo" width="700px" height="auto">

</div>

*An option to add purchases has also been included, after which the corresponding material purchased will get incremented in the inventory.


<br></br>



#### 3. Report Generation

A comprehensive report can be generated, offering valuable insights and aiding in overseeing budget management and other pertinent aspects.

<div align="center">
    <img src="readmeImg\modifiedReport.jpeg" alt="Logo" width="700px" height="auto">
    <img src="readmeImg\graph.png" alt="Logo" width="700px" height="auto">    
  
</div


<br></br>


#### 4. Maintaining Technicians and Departments

* A different tables containing information on departments, technicians, and all users is available for reference.
* The system allows for the addition of new departments, technicians, and other users.
<div align="center">
    <img src="readmeImg\departmentTable.jpeg" alt="Logo" width="700px" height="auto">
  
</div>
<div align="center">
    <img src="readmeImg\techniciansTable.jpeg" alt="Logo" width="700px" height="auto">
  
</div>


  <div align="center">
    <img src="readmeImg\allUsers.jpeg" alt="Logo" width="700px" height="auto">
  
</div>

* When a new user signs up, they are required to provide all their details. On submission, the manager must approve the user. The manager has the authority to modify the entries provided by the new user and subsequently approve them as a valid user.

<div align="center">
    <img src="readmeImg\signUp.jpeg" alt="Logo" width="200px" height="auto">
  
</div>

<div align="center">
    <img src="readmeImg\userApproval.jpeg" alt="Logo" width="700px" height="auto">
  
</div>

<br></br>

<p align="right">(<a href="#readme-top">back to top</a>)</p>





## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".
Don't forget to give the project a star! Thanks again!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- LICENSE -->
<!-- ## License

Distributed under the MIT License. See `LICENSE.txt` for more information.

<p align="right">(<a href="#readme-top">back to top</a>)</p> -->



[contributors-shield]:https://img.shields.io/badge/CONTRIBUTORS-5-green?style=for-the-badge
[contributors-url]:https://github.com/Ruthvik283/AILMS_IITI/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/othneildrew/Best-README-Template.svg?style=for-the-badge
[forks-url]: https://github.com/othneildrew/Best-README-Template/network/members
[stars-shield]: https://img.shields.io/github/stars/othneildrew/Best-README-Template.svg?style=for-the-badge
[stars-url]: https://github.com/othneildrew/Best-README-Template/stargazers
[issues-shield]: https://img.shields.io/github/issues/othneildrew/Best-README-Template.svg?style=for-the-badge
[issues-url]: https://github.com/othneildrew/Best-README-Template/issues
[license-shield]: https://img.shields.io/github/license/othneildrew/Best-README-Template.svg?style=for-the-badge
[license-url]: https://github.com/othneildrew/Best-README-Template/blob/master/LICENSE.txt
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://linkedin.com/in/othneildrew
[product-screenshot]: images/screenshot.png
[Next.js]: https://img.shields.io/badge/next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white
[Next-url]: https://nextjs.org/
[React.js]: https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[React-url]: https://reactjs.org/
[Vue.js]: https://img.shields.io/badge/Vue.js-35495E?style=for-the-badge&logo=vuedotjs&logoColor=4FC08D
[Vue-url]: https://vuejs.org/
[Tailwind-CSS]:https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white

[Angular.io]: https://img.shields.io/badge/Angular-DD0031?style=for-the-badge&logo=angular&logoColor=white
[Angular-url]: https://angular.io/
[Svelte.dev]: https://img.shields.io/badge/Svelte-4A4A55?style=for-the-badge&logo=svelte&logoColor=FF3E00
[Svelte-url]: https://svelte.dev/
[Laravel.com]: https://img.shields.io/badge/Laravel-FF2D20?style=for-the-badge&logo=laravel&logoColor=white
[Laravel-url]: https://laravel.com
[Bootstrap.com]: https://img.shields.io/badge/Bootstrap-563D7C?style=for-the-badge&logo=bootstrap&logoColor=white
[Bootstrap-url]: https://getbootstrap.com
[JQuery.com]: https://img.shields.io/badge/jQuery-0769AD?style=for-the-badge&logo=jquery&logoColor=white
[JQuery-url]: https://jquery.com 
