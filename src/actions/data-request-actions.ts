
'use server';

import type { BusinessData } from '@/types';
import { DataRequestFormSchema, type DataRequestFormData } from '@/lib/schemas';
import { mockBusinessData } // Using mock data for now
// import { firestore } from '@/lib/firebase-admin'; // Uncomment when ready to use Firestore
// import { collection, addDoc } from 'firebase-admin/firestore'; // Example Firestore import

// This is a placeholder. In a real app, you'd fetch this from environment variables.
// const GOOGLE_PLACES_API_KEY = process.env.GOOGLE_PLACES_API_KEY;

export async function fetchBusinessDataAction(
  formData: DataRequestFormData
): Promise<{ success: boolean; data?: BusinessData[]; error?: string }> {
  const validation = DataRequestFormSchema.safeParse(formData);
  if (!validation.success) {
    return { success: false, error: 'Invalid input data.' };
  }

  const { geographicRange, businessType } = validation.data;

  // --- 1. Google Places API Integration (Placeholder) ---
  // In a real implementation, you would:
  // - Ensure GOOGLE_PLACES_API_KEY is set in your environment variables.
  // - Construct the API request URL.
  // - Use `fetch` or a Google Places client library to make the request.
  // - Handle API errors and rate limits.
  //
  // Example structure:
  /*
  if (!GOOGLE_PLACES_API_KEY) {
    console.error('Google Places API key is not configured.');
    return { success: false, error: 'API key not configured.' };
  }
  const searchEndpoint = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(businessType + ' in ' + geographicRange)}&key=${GOOGLE_PLACES_API_KEY}`;
  
  let fetchedBusinesses: BusinessData[] = [];
  try {
    const response = await fetch(searchEndpoint);
    if (!response.ok) {
      throw new Error(`Google Places API error: ${response.statusText}`);
    }
    const apiResult = await response.json();
    if (apiResult.status !== 'OK' && apiResult.status !== 'ZERO_RESULTS') {
      throw new Error(`Google Places API error: ${apiResult.status} - ${apiResult.error_message || ''}`);
    }
    
    fetchedBusinesses = apiResult.results?.map((place: any) => ({
      id: place.place_id,
      name: place.name,
      address: place.formatted_address,
      phone: place.formatted_phone_number, // Often needs a separate Place Details request
      website: place.website, // Often needs a separate Place Details request
      // Email is rarely available directly from Text Search or Nearby Search.
      // You might need to scrape websites or use other data enrichment services.
      email: undefined, 
      category: place.types?.join(', '),
      details: `Rating: ${place.rating || 'N/A'}, User Ratings Total: ${place.user_ratings_total || 0}`,
    })) || [];

  } catch (error: any) {
    console.error('Error fetching from Google Places API:', error);
    return { success: false, error: error.message || 'Failed to fetch data from Google Places.' };
  }
  */

  // For now, using mock data:
  await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
  const simulatedFetchedBusinesses = mockBusinessData.filter(biz => 
    (biz.category?.toLowerCase().includes(businessType.toLowerCase()) || 
     biz.name.toLowerCase().includes(businessType.toLowerCase())) &&
    (biz.address?.toLowerCase().includes(geographicRange.toLowerCase()))
  ).slice(0, 10); // Limit results for demo

  // --- 2. Storing Data in Firestore (Placeholder) ---
  // In a real implementation, you would:
  // - Initialize firebase-admin (done in `src/lib/firebase-admin.ts`).
  // - Iterate through `fetchedBusinesses` and save each to Firestore.
  // - Handle potential errors during Firestore writes.
  /*
  if (simulatedFetchedBusinesses.length > 0) {
    try {
      const dataRequestsCollection = collection(firestore, 'dataRequests'); // Example collection name
      for (const bizData of simulatedFetchedBusinesses) {
        // You might want to add a timestamp or query metadata here
        await addDoc(dataRequestsCollection, {
          ...bizData,
          queriedAt: new Date().toISOString(),
          queryLocation: geographicRange,
          queryCategory: businessType,
        });
      }
      console.log('Data saved to Firestore successfully.');
    } catch (error: any) {
      console.error('Error saving data to Firestore:', error);
      // Decide if this should be a hard failure or just a warning
      // return { success: false, error: error.message || 'Failed to save data to database.' };
    }
  }
  */

  return { success: true, data: simulatedFetchedBusinesses };
}
