import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Grade from './Grade';
import CheckBox from './CheckBox';
import './SearchBar.css';
import { useSelector } from 'react-redux';
import GeneralSearchBar from '../../components/GenralSearchBar';
import { fetchDepartmentSkills, fetchAssignedEmployeeData, fetchSkillsForDepartment, fetchDataBySkillsAndDepartment, saveEmployeeData } from './SkillMatrixAPI';

const SearchBar = () => {
  const [departments, setDepartments] = useState([]);
  const [skills, setSkills] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedEmp, setSelectedEmp] = useState([]);
  const [newSelectedEmp, setNewSelectedEmp] = useState([]);
  const [removeEmp, setRemoveEmp] = useState([]);
  const [gradeChanges, setGradeChanges] = useState({});
  const [departmentExpSkill,setDepartmentExpSkill] = useState([]);
  const [disableAssign, setDisableAssign] = useState(false);
  const departmentId = useSelector((state) => state.auth.user?.departmentId); 
  const departmentName = useSelector((state) => state.auth.user?.departmentName);
  const access = useSelector((state) =>  state?.auth?.user?.employeeAccess).split(',')[2];

  const gradeAdd = access[5] === "1";
  const gradeRead = access[6] === "1";
  const gradeUpdate = access[7] === "1";
  const gradeDelete = access[8] === "1";

  const checkboxAdd = access[9] === "1";
  const checkboxRead = access[10] === "1";
  const checkboxUpdate = access[11] === "1";
  const checkboxDelete = access[12] === "1";

  useEffect(() => {
    invalidSelection();
  }, [gradeChanges, selectedEmp]);
  
  function invalidSelection() {
    try {
        const hasInvalidSelection = Object.values(gradeChanges).some((change) => {
        console.log("Evaluating change:", change);
  
        const isCheckboxSelected = selectedEmp.some((emp) => {
          const isMatch = emp.employeeId === change.employeeId && emp.skillId === change.skillId;
          return isMatch;
        });
  
        console.log(`Change grade: ${change.grade}, Checkbox selected: ${isCheckboxSelected}`);
        return change.grade === 4 && isCheckboxSelected;
      });
  
      console.log("Invalid selection result:", hasInvalidSelection);
  
      if (hasInvalidSelection) {
        toast.error('Cannot assign training for grade 4!');
      }
  
      setDisableAssign(hasInvalidSelection);
    } catch (error) {
      console.error("Error in invalidSelection:", error);
    }
  }
  

  useEffect(()=>{
    if(departmentId){
      console.log("DEpartet d",departmentId)
      fetchDepartmentSkills(departmentId)
        .then(skills => {
          setDepartmentExpSkill(skills);
          setSelectedSkills(skills);
        })
        .catch(error =>{
          console.error("error in fetching department skills : " , error)
        })
    }
  },[departmentId]);

  useEffect(() => {
    fetchAssignedEmployeeData()
      .then(data => {
        setSelectedEmp(data);
      })
      .catch(error => {
        console.error('There was an error fetching the data!', error);
      });
  }, []);

  useEffect(() => {
    if (departmentId) {
      fetchSkillsForDepartment(departmentId)
        .then(skills => {
          setSkills([{ label: 'Select All', value: 'select-all' }, ...skills]);
        })
        .catch(err => {
          console.error('Failed to fetch skills: ', err);
        });
    } else {
      setSkills([]);
    }
  }, [departmentId]);

  useEffect(() => {
    if (selectedSkills.length > 0) {
      fetchData();
      console.log("Selected skill : ",selectedSkills)
    } else {
      setData([]);
    }
  }, [selectedSkills]);

  useEffect(() => {
      const department = departments.find(dept => dept.departmentId === departmentId);
      if (department) {
        const departmentDetails = {
          label: department.departmentName,
          value: departmentId,
        };
        const event = new CustomEvent('departmentSelected', { detail: departmentDetails });
        window.dispatchEvent(event);
      } 
  }, [departmentId, departments]);
  

  const fetchData = () => {
    setLoading(true);
    fetchDataBySkillsAndDepartment(selectedSkills, departmentId)
      .then(response => {
        console.log("Skill id :",selectedSkills)
        console.log(response); 
        const groupedData = groupDataByEmployee(response);
        setData(groupedData);
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to fetch data');
        setLoading(false);
      });
  }; 

  const clearDepartment = () => {
    setSelectedDepartment(null);
    setSelectedSkills([]);
    setData([]);
  };


  const OnGradeChange = (employeeId, skillId, newGrade) => {
    // Check if the checkbox is selected for the given employee and skill
    const isCheckboxSelected = selectedEmp.some(
      (emp) => emp.employeeId === employeeId && emp.skillId === skillId
    );
  
    // If grade is 4 and checkbox is selected, show an error and exit
    if (newGrade === 4 && isCheckboxSelected) {
      toast.error('Grade 4 cannot be assigned when the checkbox is selected!');
      setDisableAssign(true);
      console.log("Grade 4 cannot be assigned for selected checkbox!");
      return; // Prevent further execution
    }
  
    // Update grade changes
    setGradeChanges((prev) => ({
      ...prev,
      [`${employeeId}-${skillId}`]: { employeeId, skillId, grade: newGrade },
    }));
    setTimeout(() => invalidSelection(), 0);    
  };
  

  const handleSkillChange = (selectedOptions) => {
    const isSelectAllSelected = selectedOptions.some(option => option.value === 'select-all');
  
    if (isSelectAllSelected) {
      if (selectedOptions.length === 1) {
        const allSkills = skills.filter(skill => skill.value !== 'select-all');
        setSelectedSkills(allSkills);
      } else {
        setSelectedSkills([]);
      }
    } else {
      setSelectedSkills(selectedOptions);
    }
  };

  const removeSkill = (skillToRemove) => {
    setSelectedSkills((prevSkills) => {
      const updatedSkills = prevSkills.filter((skill) => skill.id !== skillToRemove.id);
      if (updatedSkills.length === 0) {
        setData([]);
      } else {
        fetchData();
      }
      return updatedSkills;
    });
  };  

  const groupDataByEmployee = (data) => {
    const groupedData = {};
    data.forEach(row => {
      if (!groupedData[row.employeeId]) {
        groupedData[row.employeeId] = {
          employeeId: row.employeeId,
          employeeName: row.employeeName,
          skills: {},
        };
      }
      groupedData[row.employeeId].skills[row.skillId] = row.grade;
    });
    console.log(Object.values(groupedData));
    return Object.values(groupedData);
  };

  const onSelectionChange = (employeeId, skillId, isChecked) => {
    //Update the selectedEmp state
    if (isChecked) {
      setNewSelectedEmp(prevEmp => {
          const exists = prevEmp.some(emp => emp.employeeId === employeeId && emp.skillId === skillId);
          if (!exists) {
              return [...prevEmp, { employeeId: employeeId, skillId: skillId }];
          }
          return prevEmp;
      });

      setSelectedEmp(prevEmp => {
          const exists = prevEmp.some(emp => emp.employeeId === employeeId && emp.skillId === skillId);
          if (!exists) {
              return [...prevEmp, { employeeId: employeeId, skillId: skillId }];
          }
          return prevEmp;
      });
  } else {
      setNewSelectedEmp(prevEmp => prevEmp.filter(emp => !(emp.employeeId === employeeId && emp.skillId === skillId)));

      setSelectedEmp(prevEmp => {
          const exists = prevEmp.some(emp => emp.employeeId === employeeId && emp.skillId === skillId);
          if (exists) {
              setRemoveEmp(prevRemove => {
                  const existsInRemove = prevRemove.some(emp => emp.employeeId === employeeId && emp.skillId === skillId);
                  if (!existsInRemove) {
                      return [...prevRemove, { employeeId: employeeId, skillId: skillId }];
                  }
                  return prevRemove;
              });
              return prevEmp.filter(emp => !(emp.employeeId === employeeId && emp.skillId === skillId));
          }
          return prevEmp;
      });
  }
  console.log('Selected EMP : ', selectedEmp);
  console.log('New Selected emp : ', newSelectedEmp);
  console.log('Remove emp : ', removeEmp);
  
  setTimeout(() => invalidSelection(), 0);
  };
  
  const handleSave = () => {
    saveEmployeeData(newSelectedEmp, removeEmp, gradeChanges)
      .then(() => {
        toast.success("Data updated successfully!");
        setNewSelectedEmp([]);
        setRemoveEmp([]);
        setGradeChanges({});
        fetchData();
      })
      .catch((error) => {
        console.error("There was an error saving the data!", error);
        toast.error("Failed to save data.");
      });
  };

  return (
    <div className='content'>
      <div className='assign-cls'>
        <button className='assign' 
          onClick={handleSave} 
          disabled={disableAssign}
          style={{
            cursor: disableAssign ? 'not-allowed' : 'pointer',
            opacity: disableAssign ? 0.6 : 1, 
          }}
        >
          Assign
        </button>
      </div>
      <div className='button-bar'>
        <h1 className='search-bar-dept-name'>Department name: {departmentName}</h1>
        <GeneralSearchBar 
          options={departmentExpSkill}
          includeSelectAll = {true}
          isMultiSelect = {true}
          selectedValues={selectedSkills}
          setSelectedValues={setSelectedSkills}
        />
      </div>
    
      <div className="selected-skills-container">
        {selectedSkills.map(skill => (
          <div key={skill.id} className="skill-bubble">
            {skill.label}
            <span className="remove-skill" onClick={() => removeSkill(skill)}>x</span>
          </div>
        ))}
      </div>
  
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
  
      {data.length > 0 && (
        <div className="table-containerr">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                {selectedSkills.map(skill => (
                  <th key={skill.id}>{skill.label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((row, index) => (
                <tr key={index}>
                  <td>{row.employeeName}</td>
                  {selectedSkills.map(skill => (
                    <td key={skill.id}>
                      {gradeRead &&
                        <Grade 
                        pemp_id={row.employeeId}
                        pskill_id={skill.id}
                        pgrade={row.skills[skill.id] || 0}
                        onGradeChange={OnGradeChange} 
                        isChangable={gradeUpdate}
                      />}
                      {checkboxRead &&
                        <CheckBox
                        pemp_id={row.employeeId}
                        pskill_id={skill.id}
                        pselectedEmp={selectedEmp}
                        onSelectionChnge={onSelectionChange}
                        disable={row?.skills?.[skill.id] === 4}
                        disableCondition={!checkboxUpdate}
                      />}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
