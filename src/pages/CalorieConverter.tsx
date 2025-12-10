import { useState, useRef } from 'react';
import { Search, Camera, Loader2, Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { queryFoodCalories, recognizeFoodFromImage } from '@/services/llm';
import { Streamdown } from 'streamdown';

export default function CalorieConverter() {
  const [foodName, setFoodName] = useState('');
  const [result, setResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleTextSearch = async () => {
    if (!foodName.trim()) {
      toast.error('Please enter a food name');
      return;
    }

    setIsLoading(true);
    setResult('');
    setUploadedImage(null);

    try {
      const response = await queryFoodCalories(foodName);
      setResult(response);
    } catch (error) {
      toast.error('Failed to fetch calorie information. Please try again.');
      console.error('Error querying food calories:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleTextSearch();
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please upload a valid image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB');
      return;
    }

    setIsLoading(true);
    setResult('');
    setFoodName('');

    try {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const base64String = event.target?.result as string;
        const base64Data = base64String.split(',')[1];
        setUploadedImage(base64String);

        try {
          const response = await recognizeFoodFromImage(base64Data, file.type);
          setResult(response);
        } catch (error) {
          toast.error('Failed to recognize food from image. Please try again.');
          console.error('Error recognizing food:', error);
          setUploadedImage(null);
        } finally {
          setIsLoading(false);
        }
      };
      reader.readAsDataURL(file);
    } catch (error) {
      toast.error('Failed to process image. Please try again.');
      console.error('Error processing image:', error);
      setIsLoading(false);
    }
  };

  const handleClearImage = () => {
    setUploadedImage(null);
    setResult('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="min-h-screen bg-background p-4 xl:p-8">
      <div className="max-w-4xl mx-auto">
        <Card className="shadow-lg">
          <CardHeader className="text-center space-y-2">
            <CardTitle className="text-2xl xl:text-4xl font-bold text-foreground">
              🥗 Calorie Converter
            </CardTitle>
            <p className="text-sm xl:text-base text-muted-foreground">
              Look up calorie content by entering food name or uploading a photo
            </p>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="relative">
                <Input
                  type="text"
                  value={foodName}
                  onChange={(e) => setFoodName(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Enter food name (e.g., apple, chicken breast, pizza)..."
                  className="pl-10 pr-4 py-6 text-base xl:text-lg"
                  disabled={isLoading}
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              </div>

              <div className="flex flex-col xl:flex-row gap-3">
                <Button
                  onClick={handleTextSearch}
                  disabled={isLoading || !foodName.trim()}
                  className="flex-1 py-6 text-base"
                >
                  {isLoading && !uploadedImage ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Searching...
                    </>
                  ) : (
                    <>
                      <Search className="mr-2 h-5 w-5" />
                      Search Calories
                    </>
                  )}
                </Button>

                <div className="relative flex-1">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    disabled={isLoading}
                  />
                  <Button
                    onClick={handleUploadClick}
                    disabled={isLoading}
                    variant="outline"
                    className="w-full py-6 text-base"
                  >
                    {isLoading && uploadedImage ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Camera className="mr-2 h-5 w-5" />
                        Upload Food Photo
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>

            {uploadedImage && (
              <Card className="relative bg-muted">
                <Button
                  onClick={handleClearImage}
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2 z-10 h-8 w-8"
                >
                  <X className="h-4 w-4" />
                </Button>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <Upload className="h-5 w-5 text-primary" />
                    <span className="text-sm font-medium">Uploaded Image:</span>
                  </div>
                  <div className="mt-3 rounded-lg overflow-hidden">
                    <img
                      src={uploadedImage}
                      alt="Uploaded food"
                      className="w-full max-h-64 object-contain bg-card"
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {result && (
              <Card className="bg-primary/5 border-primary/20 animate-fade-in">
                <CardHeader>
                  <CardTitle className="text-xl text-primary">
                    Calorie Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose prose-sm xl:prose-base max-w-none dark:prose-invert">
                    <Streamdown>{result}</Streamdown>
                  </div>
                </CardContent>
              </Card>
            )}

            {!result && !isLoading && (
              <Card className="bg-muted/50">
                <CardContent className="p-6 xl:p-8 text-center space-y-4">
                  <div className="text-4xl xl:text-6xl">🍎</div>
                  <div className="space-y-2">
                    <h3 className="text-lg xl:text-xl font-semibold text-foreground">
                      How to Use
                    </h3>
                    <div className="text-sm xl:text-base text-muted-foreground space-y-2">
                      <p>
                        <strong>Option 1:</strong> Type the name of any food in the search box and
                        click "Search Calories"
                      </p>
                      <p>
                        <strong>Option 2:</strong> Upload a photo of your food and get instant
                        calorie information
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </CardContent>
        </Card>

        <div className="mt-6 text-center text-xs xl:text-sm text-muted-foreground">
          <p>
            Calorie information is provided as an estimate. Actual values may vary based on
            preparation methods and portion sizes.
          </p>
        </div>
      </div>
    </div>
  );
}
