import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import mongoose from 'mongoose';

export async function POST() {
  try {
    await dbConnect();
    
    // Create a raw schema without validation to access existing data
    const rawTechSchema = new mongoose.Schema({}, { strict: false });
    const RawTech = mongoose.models.RawTech || mongoose.model('RawTech', rawTechSchema, 'technicians');
    
    console.log('Checking existing tech records...');
    
    // Find all techs with 'technician' role
    const techsToUpdate = await RawTech.find({ role: 'technician' });
    console.log(`Found ${techsToUpdate.length} tech records with 'technician' role`);
    
    let updateCount = 0;
    if (techsToUpdate.length > 0) {
      // Update all records with 'technician' role to 'tech'
      const result = await RawTech.updateMany(
        { role: 'technician' },
        { $set: { role: 'tech' } }
      );
      
      updateCount = result.modifiedCount;
      console.log(`Updated ${updateCount} tech records`);
    }
    
    // Check all tech records after update
    const allTechs = await RawTech.find({});
    const roleStats = allTechs.reduce((acc, tech) => {
      acc[tech.role] = (acc[tech.role] || 0) + 1;
      return acc;
    }, {});
    
    return NextResponse.json({
      message: 'Tech roles updated successfully',
      totalTechs: allTechs.length,
      updatedCount: updateCount,
      roleDistribution: roleStats
    });
    
  } catch (error) {
    console.error('Error fixing tech roles:', error);
    return NextResponse.json(
      { 
        message: 'Failed to fix tech roles', 
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
