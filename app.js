

document.addEventListener("DOMContentLoaded", function() {
    const web3 = new Web3("HTTP://127.0.0.1:7545");
    var contractAddress="0x43fB9e11E17fF84870774c4512C343AD35062E19";
    var userAddress;

    let contract = new web3.eth.Contract([
      {
        "inputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "name": "students",
        "outputs": [
          {
            "internalType": "string",
            "name": "name",
            "type": "string"
          },
          {
            "internalType": "uint256",
            "name": "age",
            "type": "uint256"
          },
          {
            "internalType": "string",
            "name": "email",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "gender",
            "type": "string"
          }
        ],
        "stateMutability": "view",
        "type": "function",
        "constant": true
      },
      {
        "inputs": [
          {
            "internalType": "uint256",
            "name": "rollNo",
            "type": "uint256"
          },
          {
            "internalType": "string",
            "name": "_name",
            "type": "string"
          },
          {
            "internalType": "uint256",
            "name": "_age",
            "type": "uint256"
          },
          {
            "internalType": "string",
            "name": "_email",
            "type": "string"
          },
          {
            "internalType": "string[]",
            "name": "_subjects",
            "type": "string[]"
          },
          {
            "internalType": "string",
            "name": "_gender",
            "type": "string"
          }
        ],
        "name": "setData",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "uint256",
            "name": "rollNo",
            "type": "uint256"
          }
        ],
        "name": "getSubjects",
        "outputs": [
          {
            "internalType": "string[]",
            "name": "",
            "type": "string[]"
          }
        ],
        "stateMutability": "view",
        "type": "function",
        "constant": true
      }
    ], contractAddress);

    web3.eth.getAccounts(function(error, result) {
      userAddress=result[0];
    });

    document.getElementById("submitForm").addEventListener("submit", function(event) {
       event.preventDefault();
       document.getElementById('searchErrorShowing').innerHTML='';

       const selectElement = document.getElementById('inputSubjects');

       var rollNo=document.getElementById("inputRegNo").value;
       var name=document.getElementById("inputName").value;
       var age=document.getElementById("inputAge").value;
       var email=document.getElementById("inputEmail").value;
       var subject=Array.from(selectElement.selectedOptions).map(option => option.value);
       let gender = 'Not selected'; // Default value if no radio button is checked
       const genderRadios = document.querySelectorAll('input[type="radio"].gender');
        
        genderRadios.forEach(radio => {
            if (radio.checked) {
                gender = radio.value;
            }
        });
        
        contract.methods.students(rollNo).call().then((result)=>{
          
          if (result.gender=='' && result.name=='' && result.email=='')
          {
            contract.methods.setData(rollNo,name,age,email,subject,gender)
            .send({
                from: userAddress,
                gas: 5000000,
                gasPrice: '30000000000'
            })
            .then((receipt) => {
                console.log("Transaction receipt:", receipt);
                return contract.methods.students(rollNo).call();
            })
            .then((studentData) => {
              if (typeof studentData === 'object' && studentData !== null)
              {
                document.getElementById('insertErrorShowing').innerHTML='<div class="alert alert-success alert-dismissible fade show" role="alert"><center>Student Data Inserted Successfully....!</center><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';
              }
              else
              {
                document.getElementById('insertErrorShowing').innerHTML='<div class="alert alert-danger alert-dismissible fade show" role="alert"><center>Student Data Not Inserted Something is issue....!</center><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';
              }
            })
            .catch((error) => {
                console.error("Error:", error);
            });
          }
          else
          {
            document.getElementById('insertErrorShowing').innerHTML='<div class="alert alert-danger alert-dismissible fade show" role="alert"><center><strong>'+rollNo+'</strong> Roll No Allready Exist....!</center><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';
          }
        });
    });

    
    document.getElementById("searchData").addEventListener("click",async function(event) {

      document.getElementById('insertErrorShowing').innerHTML='';
      document.getElementById('searchErrorShowing').innerHTML='';

      var searchValue=document.getElementById("searchValue").value;

      contract.methods.students(searchValue).call().then(async (studentData)=>{

        if (typeof studentData === 'object' && studentData.gender!="0" && studentData.name!='')
        {
          var subjects =await contract.methods.getSubjects(searchValue).call();  //Array.isArray(studentData.subjects) ? studentData.subjects.join(', ') : '';
          document.getElementById("addStuData").innerHTML='<tr><th scope="row">'+searchValue+'</th><td>'+capitalize(studentData.name)+'</td><td>'+studentData.age+'</td><td>'+capitalize(studentData.email)+'</td><td>'+subjects.join(', ')+'</td><td>'+capitalize(studentData.gender)+'</td></tr>';
        }
        else
        {
          document.getElementById("addStuData").innerHTML='';
          document.getElementById('searchErrorShowing').innerHTML='<div class="alert alert-danger alert-dismissible fade show" role="alert"><center>Student Data Not Found....!</center><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';
        }
      });
    });

    function capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    }

});
