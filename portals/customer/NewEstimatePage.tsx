
import React, { useState } from 'react';
import { ImageUploader } from '../../components/ImageUploader';
import { Spinner } from '../../components/Spinner';
import { analyzeDamage } from '../../services/geminiService';
import { Shop, User, CarDetails, Job, AIAnalysisResult } from '../../types';
import { CarDetailsForm } from '../../components/CarDetailsForm';
import { ShopList } from '../../components/ShopList';
import { AIQuoteCard } from '../../components/AIQuoteCard';

interface NewEstimatePageProps {
    user: User;
    shops: Shop[];
    onNewJob: (jobDetails: Omit<Job, 'id' | 'lastUpdate' | 'chatHistory'>) => Job;
    onNewAIQuote: (jobDetails: Omit<Job, 'id' | 'status' | 'lastUpdate' | 'chatHistory' | 'aiAnalysis'>, aiAnalysis: AIAnalysisResult) => Job;
    onSuccess: (newJob: Job) => void;
}

const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve((reader.result as string).split(',')[1]);
        reader.onerror = (err) => reject(err);
    });
};

export const NewEstimatePage: React.FC<NewEstimatePageProps> = ({ user, shops, onNewJob, onNewAIQuote, onSuccess }) => {
  const [step, setStep] = useState<'details' | 'quote' | 'shops'>('details');
  
  const [carDetails, setCarDetails] = useState<CarDetails>({ make: '', model: '', year: '', vin: '', registrationNo: '' });
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [analysisResult, setAnalysisResult] = useState<AIAnalysisResult | null>(null);
  
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  const [shopFilters, setShopFilters] = useState({ rating: 0, priceRange: 'any' as 'any' | 'low' | 'medium' | 'high', availability: true });

  const handleCarDetailsChange = (field: keyof CarDetails, value: string) => {
    setCarDetails(prev => ({ ...prev, [field]: value }));
  };
  
  const handleAnalyze = async () => {
    if (imageFiles.length === 0) {
        setError('Please upload at least one image of the damage.');
        return;
    }
    setError(null);
    setIsLoading(true);
    try {
        const base64Image = await fileToBase64(imageFiles[0]); // Use first image for analysis
        const result = await analyzeDamage(base64Image);
        setAnalysisResult(result);
        setStep('quote');
    } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred during AI analysis.');
    } finally {
        setIsLoading(false);
    }
  };
  
  const createBaseJob = (shop: Shop): Omit<Job, 'id' | 'lastUpdate' | 'chatHistory' | 'status'> => ({
      customerEmail: user.email,
      shop,
      carDetails,
      photos: { damage: imageFiles.map(f => URL.createObjectURL(f)), inProgress: [], completed: [] },
  });

  const handleBookAppointment = (shop: Shop) => {
      if (!analysisResult) return;
      const baseJob = createBaseJob(shop);
      const newJob = onNewAIQuote(baseJob, analysisResult);
      onSuccess(newJob);
  };
  
  const handleManualQuote = (shop: Shop) => {
      const baseJob = createBaseJob(shop);
      const newJob = onNewJob({ ...baseJob, status: 'New' });
      onSuccess(newJob);
  };

  return (
     <div className="max-w-4xl mx-auto animate-in fade-in duration-300 space-y-8">
        <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-slate-800 to-cyan-600 dark:from-white dark:to-cyan-300 tracking-tight">
                Get a New Estimate
            </h1>
            <p className="mt-4 text-lg text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
               Upload a photo of the damage to get started with an instant AI-powered estimate.
            </p>
        </div>
        
        {error && (
            <div className="bg-red-100 dark:bg-red-500/10 border border-red-300 dark:border-red-500/30 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg" role="alert">
                {error}
            </div>
        )}

        {/* Step 1: Details & Upload */}
        {(step === 'details') && (
            <div className="bg-white dark:bg-slate-900/50 backdrop-blur-xl rounded-2xl shadow-lg dark:shadow-2xl p-6 md:p-8 border border-slate-200 dark:border-slate-700/50 space-y-8">
                <CarDetailsForm carDetails={carDetails} onCarChange={handleCarDetailsChange} onScan={() => {}} isScanning={false} />
                <div className="p-6 bg-gray-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-1">Upload Damage Photos</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">Provide clear photos from multiple angles for an accurate estimate.</p>
                    <ImageUploader onImagesChange={setImageFiles} imagePreviews={imageFiles.map(f => URL.createObjectURL(f))} />
                </div>
                <button onClick={handleAnalyze} disabled={isLoading || imageFiles.length === 0} className="w-full flex items-center justify-center gap-3 text-lg font-semibold text-white bg-gradient-to-r from-violet-600 to-indigo-600 rounded-lg px-8 py-4 disabled:from-slate-400 dark:disabled:from-slate-500 disabled:cursor-not-allowed">
                   {isLoading ? <Spinner className="h-6 w-6" /> : "Get AI Estimate"}
                </button>
            </div>
        )}

        {/* Step 2: Show Quote & Shops */}
        {(step === 'quote' || step === 'shops') && analysisResult && (
             <>
                <AIQuoteCard analysis={analysisResult} />
                <ShopList 
                    shops={shops} 
                    onBookAppointment={handleBookAppointment}
                    onManualQuote={handleManualQuote}
                    isLoading={false}
                    filters={shopFilters}
                    onFilterChange={(filter, value) => setShopFilters(prev => ({ ...prev, [filter]: value }))}
                />
            </>
        )}
    </div>
  );
};
