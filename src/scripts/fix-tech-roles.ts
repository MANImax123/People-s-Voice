import mongoose from 'mongoose';
import dbConnect from '@/lib/mongodb';

// Create a raw schema without validation to access existing data
const rawTechSchema = new mongoose.Schema({}, { strict: false });
const RawTech = mongoose.models.RawTech || mongoose.model('RawTech', rawTechSchema, 'technicians');

export async function fixTechRoles() {
  try {
    await dbConnect();
    
    console.log('Checking existing tech records...');
    
    // Find all techs with 'technician' role
    const techsToUpdate = await RawTech.find({ role: 'technician' });
    console.log(`Found ${techsToUpdate.length} tech records with 'technician' role`);
    
    if (techsToUpdate.length > 0) {
      // Update all records with 'technician' role to 'tech'
      const result = await RawTech.updateMany(
        { role: 'technician' },
        { $set: { role: 'tech' } }
      );
      
      console.log(`Updated ${result.modifiedCount} tech records`);
    }
    
    // Check all tech records
    const allTechs = await RawTech.find({});
    console.log('All tech records:');
    allTechs.forEach(tech => {
      console.log(`- ${tech.email}: role=${tech.role}`);
    });
    
  } catch (error) {
    console.error('Error fixing tech roles:', error);
  }
}

// If running this file directly
if (require.main === module) {
  fixTechRoles().then(() => {
    console.log('Role fix complete');
    process.exit(0);
  }).catch(error => {
    console.error('Role fix failed:', error);
    process.exit(1);
  });
}
