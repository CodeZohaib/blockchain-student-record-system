// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.8.0 <0.9.0;

contract StudentData {
    struct Student {
        string name;
        uint age;
        string email;
        string[] subjects;
        string gender;
    }

    mapping(uint => Student) public students;

    function setData(uint rollNo, string memory _name, uint _age, string memory _email, string[] memory _subjects, string memory _gender) public {
        Student memory newStudent = Student(_name, _age, _email, _subjects, _gender);
        students[rollNo] = newStudent;
    }

    function getSubjects(uint rollNo) public view returns (string[] memory) {
        return students[rollNo].subjects;
    }
}
