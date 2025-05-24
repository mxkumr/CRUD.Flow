
'use server';

import type { BusinessData } from '@/types';
import { DataRequestFormSchema, type DataRequestFormData } from '@/lib/schemas';
import { mockBusinessData } from '@/lib/constants';
import { firestore } from '@/lib/firebase-admin';
// Removed client SDK imports: import { collection, addDoc } from 'firebase/firestore';

// This is a placeholder. In a real app, you'd fetch this from environment variables.
// const GOOGLE_PLACES_API_KEY = process.env.GOOGLE_PLACES_API_KEY;

export async function fetchBusinessDataAction(
  formData: DataRequestFormData
): Promise<{ success: boolean; data?: BusinessData[]; error?: string }> {
  if (!firestore) {
    console.error('CRITICAL: Firestore admin instance is not available in fetchBusinessDataAction. This indicates a Firebase Admin SDK initialization issue. Please check server logs and ensure FIREBASE_SERVICE_ACCOUNT_KEY_JSON is correctly configured.');
    return { success: false, error: 'Database service is currently unavailable. Please try again later or contact support.' };
  }

  const validation = DataRequestFormSchema.safeParse(formData);
  if (!validation.success) {
    // console.error('Validation errors:', validation.error.flatten().fieldErrors);
    return { success: false, error: 'Invalid input data. ' + JSON.stringify(validation.error.flatten().fieldErrors) };
  }

  const { geographicRange, businessType, assignedToUserId } = validation.data;

  // --- 1. Google Places API Integration (Placeholder) ---
  // In a real implementation, you would:
  // - Ensure GOOGLE_PLACES_API_KEY is set in your environment variables.
  // - Construct the API request URL.
  // - Use `fetch` or a Google Places client library to make the request.
  // - Handle API errors and rate limits.
  
  // Example structure for actual API call:
  /*
  if (!GOOGLE_PLACES_API_KEY) {
    console.error('Google Places API key is not configured.');
    return { success: false, error: 'API key not configured.' };
  }
  const searchEndpoint = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(businessType + ' in ' + geographicRange)}&key=${GOOGLE_PLACES_API_KEY}`;
  
  let fetchedBusinessesFromAPI: any[] = []; // Type this properly based on API response
  try {
    const response = await fetch(searchEndpoint);
    if (!response.ok) {
      throw new Error(`Google Places API error: ${response.statusText}`);
    }
    const apiResult = await response.json();
    if (apiResult.status !== 'OK' && apiResult.status !== 'ZERO_RESULTS') {
      throw new Error(`Google Places API error: ${apiResult.status} - ${apiResult.error_message || ''}`);
    }
    fetchedBusinessesFromAPI = apiResult.results || [];
  } catch (error: any) {
    console.error('Error fetching from Google Places API:', error);
    return { success: false, error: error.message || 'Failed to fetch data from Google Places.' };
  }

  const businessesToProcess: BusinessData[] = fetchedBusinessesFromAPI.map((place: any) => ({
      id: place.place_id, // Google Place ID can serve as a unique ID
      name: place.name,
      address: place.formatted_address,
      // Phone & website often require a separate Place Details request for better accuracy
      phone: place.formatted_phone_number, 
      website: place.website,
      email: undefined, // Email is rarely available directly
      category: place.types?.join(', '),
      details: `Rating: ${place.rating || 'N/A'}, User Ratings Total: ${place.user_ratings_total || 0}`,
      // assignedToUserId: assignedToUserId, // Add if assigning
  }));
  */

  // For now, using mock data and simulating the process:
  await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
  const simulatedFetchedBusinesses = mockBusinessData.filter(biz => 
    (biz.category?.toLowerCase().includes(businessType.toLowerCase()) || 
     biz.name.toLowerCase().includes(businessType.toLowerCase())) &&
    (biz.address?.toLowerCase().includes(geographicRange.toLowerCase()))
  ).slice(0, 10).map(biz => ({ ...biz, assignedToUserId: assignedToUserId })); // Add assignedToUserId to mock data

  // --- 2. Storing Data in Firestore ---
  if (simulatedFetchedBusinesses.length > 0) {
    try {
      const dataRequestsCollectionRef = firestore.collection('dataRequests'); // Use Admin SDK

      for (const bizData of simulatedFetchedBusinesses) {
        const docData = {
          ...bizData, // Spread original bizData which might include id
          queriedAt: new Date().toISOString(),
          queryLocation: geographicRange,
          queryCategory: businessType,
          assignedToUserId: assignedToUserId || null, // Ensure it's null if undefined
        };
        // If bizData.id is the Google Place ID, you might want to use it as the Firestore document ID:
        // await dataRequestsCollectionRef.doc(bizData.id).set(docData);
        // Or let Firestore auto-generate an ID:
        await dataRequestsCollectionRef.add(docData); // Use Admin SDK's add method
      }
      console.log('Data saved to Firestore successfully.');
    } catch (error: any) {
      console.error('Error saving data to Firestore:', error);
      return { success: false, error: error.message || 'Failed to save data to database.' };
    }
  }

  return { success: true, data: simulatedFetchedBusinesses };
}
