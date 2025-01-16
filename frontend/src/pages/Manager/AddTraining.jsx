import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Textfield from '../../components/Textfield';
import CustomDatePicker from '../../components/CustomDatePicker';
import { toast } from 'react-toastify'; 
import './AddTraining.css';
import dayjs from 'dayjs';
import GeneralSearchBar from '../../components/GenralSearchBar';
import 'react-toastify/dist/ReactToastify.css';
import { MenuItem, FormControl, InputLabel, Select } from '@mui/material';
import { fetchTrainersBySkills, fetchSkillsByDepartment, addTraining, updateTraining } from './TrainingAPI';
import { useSelector } from 'react-redux';

const AddTraining = ({ onTrainingAdded, editTrainingData, isEditing, setIsEditing, prevSelectedSkill}) => {
  const [newTraining, setNewTraining] = useState({
    trainingTitle: "",
    trainerId: "",
    trainerName: "",
    startTrainingDate: null, 
    endTrainingDate: null,   
    skills: [],
    evaluationType: "",
  });

  const [skillOptions, setSkillOptions] = useState([]);
  const [selectedSkills, setSelectedSkills] = useState(prevSelectedSkill || []);
  const [selectedTrainerIds, setSelectedTrainerIds] = useState([]);
  const [employeeOptions, setEmployeeOptions] = useState([]);
  const [searchedEmp, setSearchedEmp] = useState("");
  const [evaluationType, setEvaluationType] = useState(editTrainingData?.evaluationType || '');
  const departmentId = useSelector((state) => state.auth.user?.departmentId);
  
  useEffect(() => {
    if (selectedSkills.length > 0) {
      (async () => {
        const skillIds = selectedSkills.map(skill => skill.id).join(',');
        const trainers = await fetchTrainersBySkills(skillIds);
        if (trainers) {
          setEmployeeOptions(trainers.map(emp => ({
            id: emp.employeeId,
            label: emp.employeeName,
          })));
        }
      })();
    } else {
      setEmployeeOptions([]);
    }
  }, [selectedSkills]);

  
  // Fetch all skills
  useEffect(() => {
    if (departmentId) {
      (async () => {
        const skills = await fetchSkillsByDepartment(departmentId);
        if (skills) {
          setSkillOptions(skills.map(skill => ({
            id: skill.skillId,
            label: skill.skillName,
          })));
        }
      })();
    }
  }, [departmentId]);

  //fetch employees
    const handleSelectEmployee = ((employeeInfo) =>{
      setSearchedEmp(employeeInfo);
      if (employeeInfo) {
            setNewTraining(prevState => ({
              ...prevState,
              trainerId: employeeInfo.id,
              trainerName: employeeInfo.label,
            }));
          }
          console.log("After selecting trainer : " , newTraining)
    })

  //edit training
  useEffect(() => {
    if (isEditing && editTrainingData) {
      console.log("Edit data:", editTrainingData);

      const formattedStartDate = editTrainingData.startTrainingDate
        ? dayjs(editTrainingData.startTrainingDate).format("YYYY-MM-DD")
        : null;
      const formattedEndDate = editTrainingData.endTrainingDate
        ? dayjs(editTrainingData.endTrainingDate).format("YYYY-MM-DD")
        : null;
      
      const skillsArray = Array.isArray(editTrainingData.skills)
            ? editTrainingData.skills.map((skill) => {
                  if (typeof skill === "object" && skill.id && skill.label) {
                      const matchedSkill = skillOptions.find(
                          (option) => option.id === skill.id && option.label === skill.label
                      );
                      return matchedSkill || { id: skill.id, label: skill.label };
                  } else if (typeof skill === "string") {            
                      const matchedSkill = skillOptions.find(
                          (option) => option.label === skill.trim()
                      );
                      return matchedSkill || { id: null, label: skill.trim() };
                  }
                  return null; 
              }).filter(Boolean) 
            : typeof editTrainingData.skills === "string"
            ? editTrainingData.skills.split(",").map((skill) => {
                  const matchedSkill = skillOptions.find(
                      (option) => option.label === skill.trim()
                  );
                  return matchedSkill || { id: null, label: skill.trim() };
              })
            : [];
      
      console.log("Skill options:", skillOptions);  
      console.log("Parsed Skills Array:", skillsArray); 

      const trainer = employeeOptions.find(emp => emp.label === editTrainingData.trainerName);
      const trainerId = trainer ? trainer.id : "";
      const calculatedDays = dayjs(editTrainingData.endTrainingDate).diff(
        dayjs(editTrainingData.startTrainingDate),
        "day"
      );
      const evaluationTypeValue = reverseEvaluationType(editTrainingData.evaluationType);

      console.log("Trainer id fetched:", trainerId);
      setNewTraining({
        trainingTitle: editTrainingData.trainingTitle || "",
        trainerId: editTrainingData.trainerId,
        trainerName: editTrainingData.trainerName || "",
        startTrainingDate: formattedStartDate, 
        endTrainingDate: formattedEndDate,
        skills: skillOptions || [],
        evaluationType: editTrainingData.evaluationType || "",
        numberOfDays: Math.abs(calculatedDays) || "",
      });
      
      console.log("Edited data:", newTraining);
      setSelectedSkills(skillsArray);
      setEvaluationType(evaluationTypeValue || "");
    }
  }, [isEditing, editTrainingData, skillOptions]);

   
  function mapEvaluationType(value) {
    const evaluationTypeMapping = {
      'mcq': 1,
      'assignments': 2,
    };
    return evaluationTypeMapping[value] || null; 
  }
  
  function reverseEvaluationType(value) {
    const evaluationTypeMapping = {
      1: 'mcq',
      2: 'assignments',
    };
    return evaluationTypeMapping[value] || null; 
  }
  

  const handleEvaluationTypeChange = (event) => {
    const selectedValue = event.target.value;
    setEvaluationType(selectedValue);

    const evaluationTypeValue = mapEvaluationType(selectedValue);
    setNewTraining(prevState => ({
      ...prevState,
      evaluationType: evaluationTypeValue,
    }));
    console.log("Evaluation Type Selected:", selectedValue);
    console.log("Original one: ", newTraining);
    console.log("Updated newTraining:", {
      ...newTraining,
      evaluationType: evaluationTypeValue,
    });
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTraining(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleDateChange = (name, date) => {
    const today = dayjs().startOf('day'); 
    const selectedDate = dayjs(date).startOf('day'); 
    const { startTrainingDate, endTrainingDate } = newTraining;
  
    if (name === "startTrainingDate") {
      if (selectedDate.isBefore(today)) {
        toast.error("Start date cannot be in the past!");
        return; 
      }
      if (endTrainingDate && selectedDate.isAfter(dayjs(endTrainingDate))) {
        toast.error("Start date cannot be later than the end date!");
        return; 
      }
    } else if (name === "endTrainingDate") {
      if (selectedDate.isBefore(dayjs(startTrainingDate))) {
        toast.error("End date cannot be earlier than the start date!");
        return; 
      }
    }
  
    setNewTraining(prevState => {
      const updatedState = {
        ...prevState,
        [name]: selectedDate,
      };
  
      if (updatedState.startTrainingDate && updatedState.endTrainingDate) {
        const calculatedDays = dayjs(updatedState.endTrainingDate).diff(
          dayjs(updatedState.startTrainingDate),
          'day'
        );
        updatedState.numberOfDays = Math.abs(calculatedDays);
      } else {
        updatedState.numberOfDays = "";
      }
  
      return updatedState;
    });
  };
  
  const handleNumberOfDaysChange = (e) => {
    const days = parseInt(e.target.value, 10);
    const today = dayjs().startOf('day');
    const { startTrainingDate, endTrainingDate } = newTraining;

    if (!startTrainingDate || !endTrainingDate) {
      toast.error("Please fill both start and end dates before entering the number of days!");
      return;
    }
  
    const calculatedDays = dayjs(endTrainingDate).diff(dayjs(startTrainingDate), 'day');
    if (days !== Math.abs(calculatedDays)) {
      toast.error("The number of days entered does not match the training duration!");
      return;
    }
  
    setNewTraining(prevState => ({
      ...prevState,
      numberOfDays: days,
    }));
  };

  // const handleSelectSkill = async (values) => {
  //   console.log("Selected skills:", values);
    
  //   setSelectedSkills(values);
  //   setNewTraining((prevState) => ({
  //     ...prevState,
  //     skills: values.map((value) => ({
  //       id: value.id,
  //       label: value.label,
  //     })),
  //   }));
  
  //   const skillIds = values.map(skill => skill.id).join(',');
  //   console.log("My new         :", skillIds);
  //   if (skillIds === '') {
  //     setEmployeeOptions([]);
  //     setSearchedEmp("");
  //     setNewTraining((prevState) => ({
  //       ...prevState,
  //       trainerId: "",
  //       trainerName: "",
  //     }));
  //     return;
  //   }
  //   try {
  //     const response = await axios.get('http://localhost:8081/api/employees', {
  //       params: { skillIds },
  //     });
  //     console.log("Response from server:", response.data);
  //     setEmployeeOptions(response.data.map(emp => ({
  //       id: emp.employeeId,
  //       label: emp.employeeName,
  //     })));
  //   } catch (error) {
  //     console.error('Error fetching trainers:', error);
  //   }
  //  };
  

  const handleSaveTraining = async () => {
    console.log("New training:",newTraining);
    if (!newTraining.trainingTitle || !newTraining.trainerId || !newTraining.startTrainingDate || !newTraining.endTrainingDate) {
      toast.error('Please fill in all required fields!');
      return;
    }
    const startDate = dayjs(newTraining.startTrainingDate).format("YYYY-MM-DD");
    const endDate = dayjs(newTraining.endTrainingDate).format("YYYY-MM-DD");
    const today = dayjs(new Date()).format("YYYY-MM-DD");
    const evaluationTypeValue = mapEvaluationType(evaluationType);
    console.log("Final evaluation: ", evaluationType);
    console.log("Final evaluation value:  ", evaluationTypeValue);

    if(startDate >= today && endDate >= startDate){
      try {
        const formattedTraining = {
          ...newTraining,
          trainerId: parseInt(newTraining.trainerId, 10),
          startTrainingDate: dayjs(newTraining.startTrainingDate).format("YYYY-MM-DD"),
          endTrainingDate: dayjs(newTraining.endTrainingDate).format("YYYY-MM-DD"),
          skills: selectedSkills,
          evaluationType: evaluationTypeValue,
        };
        console.log("Initial data:", newTraining);
        console.log("After formatting everything:", formattedTraining); 
        
        console.log("Start:", startDate);
        console.log("End:", endDate);
        if (isEditing) {
          const confirmUpdate = window.confirm("Do you want to update the training details?");
          if (!confirmUpdate) return;
    
          const success = await updateTraining(editTrainingData?.trainingId, formattedTraining);
          resetForm();
          setIsEditing(false);
          onTrainingAdded(formattedTraining);
        } else {
          toast.success('Training added successfully!');
          onTrainingAdded(updateTraining);
          try{
            const success = await addTraining(formattedTraining);
            console.log("Success:", success.trainingId);
            const updateTraining = {
              ...formattedTraining,
              trainingId: success.trainingId,
            }
            resetForm();
          }catch{
            console.log("Error in adding training");
          }
        }
    
        resetForm();
      } catch (error) {
        console.error('Error saving training:', error);
        toast.error('Failed to save the training!');
      }
    }
    else{
      toast.error("Select dates properly!");
    }
    
  }; 
  
  const resetForm = () => {
    setNewTraining({
      trainingTitle: '',
      trainerId: '',
      startTrainingDate: null,
      endTrainingDate: null,
      skills: [],
      evaluationType: "",
      numberOfDays: "",
    });
    setSelectedSkills([]);
    setSelectedTrainerIds([]);
    setEvaluationType("");
  };

  return (
 
      <div className="add-training-form">
        <Textfield
          label="Training Name"
          name="trainingTitle"
          value={newTraining.trainingTitle}
          onChange={handleInputChange}
          isRequired={true}
        />
        <CustomDatePicker
          label="Start Training Date"
          selected={dayjs(newTraining.startTrainingDate).toDate()} 
          onChange={(newDate) => handleDateChange("startTrainingDate", newDate)}
        />
        <CustomDatePicker
          label="End Training Date"
          selected={dayjs(newTraining.endTrainingDate).toDate()} 
          onChange={(newDate) => handleDateChange("endTrainingDate", newDate)}
        />
        <Textfield
          label="Number of Days"
          name="numberOfDays"
          value={newTraining.numberOfDays || ""}
          onChange={handleNumberOfDaysChange}
          isRequired={true}
          disabled={!newTraining.startTrainingDate || !newTraining.endTrainingDate}
        />
        <GeneralSearchBar
          options={skillOptions} 
          label="Skills"
          displayKey="label" 
          isMultiSelect={true} 
          selectedValues={selectedSkills} 
          setSelectedValues={setSelectedSkills} 
          includeSelectAll={true}
        />
        <GeneralSearchBar
          options={employeeOptions}
          label='Search Trainer'
          displayKey='label'
          isMultiSelect={false}
          selectedValues={{
            id: newTraining.trainerId,  
            label: newTraining.trainerName,  
          }}
          setSelectedValues={handleSelectEmployee}
          includeSelectAll={false}
          disabled={selectedSkills.length === 0}
        />

        <FormControl
            variant="outlined"
            sx={{
                width: '250px', 
                '& .MuiInputBase-root': {
                    height: '50px',
                    borderRadius: 2, 
                },
                '& .MuiFormLabel-root': {
                    height: '50px',
                    lineHeight: '50px',
                    top: '-15px', 
                },
            }}
        >
            <InputLabel id="evaluation-type-label">Evaluation Type</InputLabel>
            <Select
                labelId="evaluation-type-label"
                id="evaluation-type"
                value={evaluationType}
                onChange={handleEvaluationTypeChange}
                label="Evaluation Type"
                sx={{
                    '& .MuiSelect-select': {
                        paddingTop: '0px', 
                        paddingBottom: '0px',
                    },
                }}
            >
                <MenuItem value="mcq">Multiple Choice Questions</MenuItem>
                <MenuItem value="assignments">Assignments</MenuItem>
            </Select>
        </FormControl>


        <button onClick={handleSaveTraining} className="save-training-btn">
          {isEditing ? 'Update' : 'Save'}
        </button>
      </div>
  );
};

export default AddTraining;
