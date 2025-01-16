import axios from 'axios';
import { toast } from 'react-toastify';


export const departmentExpectedSkill = async () => {
    try{
        const response = await axios.get(`http://localhost:3000/expected-department-skill`);
        console.log("API Response:", response);
        return response;
    } catch (error){
        toast.error('Error fetching grade');
        throw error;
    }
}

export const skillTrainingByDepartment = async () => {
    try {
        const response = await axios.get(`http://localhost:3000/departments`);
        return response.data;
    } catch (error){
        toast.error('Error fetching departments');
        throw error;
    }
}

// Deactivate a skill
export const deactivateSkill = async (skillId) => {
    try {
      const response = await axios.put(`http://localhost:3000/skills/${skillId}/deactivate`);
      return response.data;
    } catch (error) {
      toast.error('Failed to deactivate skill.');
      throw error;
    }
  };

  export const updateSkill = async (skillData) => {
    try {
      console.log("asds ajsd ajsfdjdk adsjhfl",skillData);
      const response = await axios.put(`http://localhost:3000/update-departmentSkill-skill`, skillData);
      return response;
    } catch (error) {
      toast.error('Failed to update skill.');
      throw error;
    }
  };
  
  // Add a new skill
  export const addSkill = async (skillData) => {
    try {
      const response = await axios.post(`http://localhost:3000/insert-into-departmentSkill`, skillData);
      return response.data;
    } catch (error) {
      toast.error('Failed to add skill.');
      throw error;
    }
  };

  // Remove skill from department skill (for both types 2 and 3)
export const removeSkillFromDepartment = async (body, url) => {
    try {
      const response = await axios.delete(url, { data: body });
      return response.data;
    } catch (error) {
      toast.error('Error in removing from department skill');
      throw error;
    }
  };
  
  // Add skill to department skill (for both types 2 and 3)
  export const addSkillToDepartment = async (body, url) => {
    try {
      const response = await axios.post(url, body);
      return response.data;
    } catch (error) {
      toast.error('Error adding skill to department skill');
      throw error;
    }
  };