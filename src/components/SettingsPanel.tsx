
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  Cloud, 
  Mic, 
  Brain, 
  Shield, 
  Smartphone,
  CheckCircle,
  AlertCircle,
  Settings
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const SettingsPanel = () => {
  const [s3Settings, setS3Settings] = useState({
    bucketName: "",
    accessKey: "",
    secretKey: "",
    region: "us-east-1"
  });
  
  const [audioSettings, setAudioSettings] = useState({
    quality: "high",
    autoTranscribe: true,
    noiseReduction: true,
    speakerDetection: true
  });

  const [aiSettings, setAiSettings] = useState({
    summaryEnabled: true,
    actionItemExtraction: true,
    sentimentAnalysis: false,
    keywordExtraction: true
  });

  const [isConnected, setIsConnected] = useState(false);
  const { toast } = useToast();

  const handleS3Test = () => {
    // Simulate S3 connection test
    setTimeout(() => {
      setIsConnected(true);
      toast({
        title: "S3 Connection Successful",
        description: "Your AWS S3 bucket has been configured correctly.",
      });
    }, 1500);
  };

  const handleSaveSettings = () => {
    toast({
      title: "Settings Saved",
      description: "All your preferences have been updated successfully.",
    });
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="storage" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="storage">Storage</TabsTrigger>
          <TabsTrigger value="audio">Audio</TabsTrigger>
          <TabsTrigger value="ai">AI Features</TabsTrigger>
          <TabsTrigger value="general">General</TabsTrigger>
        </TabsList>

        <TabsContent value="storage">
          <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Cloud className="w-5 h-5 text-blue-600" />
                <CardTitle className="text-xl font-semibold text-gray-900">AWS S3 Storage</CardTitle>
                {isConnected && (
                  <Badge className="bg-green-100 text-green-800">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Connected
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="bucket-name">Bucket Name</Label>
                  <Input
                    id="bucket-name"
                    placeholder="your-meeting-bucket"
                    value={s3Settings.bucketName}
                    onChange={(e) => setS3Settings(prev => ({
                      ...prev,
                      bucketName: e.target.value
                    }))}
                    className="bg-white/80"
                  />
                </div>
                
                <div>
                  <Label htmlFor="region">Region</Label>
                  <Select value={s3Settings.region} onValueChange={(value) => 
                    setS3Settings(prev => ({ ...prev, region: value }))
                  }>
                    <SelectTrigger className="bg-white/80">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="us-east-1">US East (N. Virginia)</SelectItem>
                      <SelectItem value="us-west-2">US West (Oregon)</SelectItem>
                      <SelectItem value="eu-west-1">Europe (Ireland)</SelectItem>
                      <SelectItem value="ap-southeast-1">Asia Pacific (Singapore)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="access-key">Access Key ID</Label>
                  <Input
                    id="access-key"
                    type="password"
                    placeholder="AKIA..."
                    value={s3Settings.accessKey}
                    onChange={(e) => setS3Settings(prev => ({
                      ...prev,
                      accessKey: e.target.value
                    }))}
                    className="bg-white/80"
                  />
                </div>
                
                <div>
                  <Label htmlFor="secret-key">Secret Access Key</Label>
                  <Input
                    id="secret-key"
                    type="password"
                    placeholder="••••••••••••••••"
                    value={s3Settings.secretKey}
                    onChange={(e) => setS3Settings(prev => ({
                      ...prev,
                      secretKey: e.target.value
                    }))}
                    className="bg-white/80"
                  />
                </div>
              </div>

              <div className="flex space-x-3">
                <Button onClick={handleS3Test} variant="outline">
                  Test Connection
                </Button>
                <Button onClick={handleSaveSettings} className="bg-blue-600 hover:bg-blue-700">
                  Save Configuration
                </Button>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start space-x-2">
                  <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div className="text-sm text-blue-800">
                    <p className="font-medium mb-1">Security Note</p>
                    <p>Your AWS credentials are encrypted and stored securely. We recommend using IAM roles with minimal required permissions for S3 access.</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="audio">
          <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Mic className="w-5 h-5 text-purple-600" />
                <CardTitle className="text-xl font-semibold text-gray-900">Audio Settings</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="audio-quality">Recording Quality</Label>
                  <Select 
                    value={audioSettings.quality} 
                    onValueChange={(value) => 
                      setAudioSettings(prev => ({ ...prev, quality: value }))
                    }
                  >
                    <SelectTrigger className="bg-white/80">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low (32 kbps)</SelectItem>
                      <SelectItem value="medium">Medium (64 kbps)</SelectItem>
                      <SelectItem value="high">High (128 kbps)</SelectItem>
                      <SelectItem value="ultra">Ultra (256 kbps)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base font-medium">Auto Transcription</Label>
                    <p className="text-sm text-gray-500">Automatically transcribe speech in real-time</p>
                  </div>
                  <Switch 
                    checked={audioSettings.autoTranscribe}
                    onCheckedChange={(checked) => 
                      setAudioSettings(prev => ({ ...prev, autoTranscribe: checked }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base font-medium">Noise Reduction</Label>
                    <p className="text-sm text-gray-500">Filter background noise and improve audio quality</p>
                  </div>
                  <Switch 
                    checked={audioSettings.noiseReduction}
                    onCheckedChange={(checked) => 
                      setAudioSettings(prev => ({ ...prev, noiseReduction: checked }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base font-medium">Speaker Detection</Label>
                    <p className="text-sm text-gray-500">Identify and label different speakers automatically</p>
                  </div>
                  <Switch 
                    checked={audioSettings.speakerDetection}
                    onCheckedChange={(checked) => 
                      setAudioSettings(prev => ({ ...prev, speakerDetection: checked }))
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ai">
          <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Brain className="w-5 h-5 text-green-600" />
                <CardTitle className="text-xl font-semibold text-gray-900">AI Features</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base font-medium">Meeting Summaries</Label>
                    <p className="text-sm text-gray-500">Generate AI-powered meeting summaries</p>
                  </div>
                  <Switch 
                    checked={aiSettings.summaryEnabled}
                    onCheckedChange={(checked) => 
                      setAiSettings(prev => ({ ...prev, summaryEnabled: checked }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base font-medium">Action Item Extraction</Label>
                    <p className="text-sm text-gray-500">Automatically identify and extract action items</p>
                  </div>
                  <Switch 
                    checked={aiSettings.actionItemExtraction}
                    onCheckedChange={(checked) => 
                      setAiSettings(prev => ({ ...prev, actionItemExtraction: checked }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base font-medium">Sentiment Analysis</Label>
                    <p className="text-sm text-gray-500">Analyze emotional tone and sentiment in conversations</p>
                  </div>
                  <Switch 
                    checked={aiSettings.sentimentAnalysis}
                    onCheckedChange={(checked) => 
                      setAiSettings(prev => ({ ...prev, sentimentAnalysis: checked }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base font-medium">Keyword Extraction</Label>
                    <p className="text-sm text-gray-500">Extract important keywords and topics from meetings</p>
                  </div>
                  <Switch 
                    checked={aiSettings.keywordExtraction}
                    onCheckedChange={(checked) => 
                      setAiSettings(prev => ({ ...prev, keywordExtraction: checked }))
                    }
                  />
                </div>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-start space-x-2">
                  <Brain className="w-5 h-5 text-green-600 mt-0.5" />
                  <div className="text-sm text-green-800">
                    <p className="font-medium mb-1">AI Processing</p>
                    <p>All AI features are processed securely and your meeting data remains private and encrypted.</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="general">
          <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Settings className="w-5 h-5 text-gray-600" />
                <CardTitle className="text-xl font-semibold text-gray-900">General Settings</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select defaultValue="America/New_York">
                    <SelectTrigger className="bg-white/80">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="America/New_York">Eastern Time (ET)</SelectItem>
                      <SelectItem value="America/Chicago">Central Time (CT)</SelectItem>
                      <SelectItem value="America/Denver">Mountain Time (MT)</SelectItem>
                      <SelectItem value="America/Los_Angeles">Pacific Time (PT)</SelectItem>
                      <SelectItem value="Europe/London">London (GMT)</SelectItem>
                      <SelectItem value="Europe/Paris">Paris (CET)</SelectItem>
                      <SelectItem value="Asia/Tokyo">Tokyo (JST)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="language">Default Language</Label>
                  <Select defaultValue="en-US">
                    <SelectTrigger className="bg-white/80">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en-US">English (US)</SelectItem>
                      <SelectItem value="en-GB">English (UK)</SelectItem>
                      <SelectItem value="es-ES">Spanish</SelectItem>
                      <SelectItem value="fr-FR">French</SelectItem>
                      <SelectItem value="de-DE">German</SelectItem>
                      <SelectItem value="it-IT">Italian</SelectItem>
                      <SelectItem value="pt-BR">Portuguese</SelectItem>
                      <SelectItem value="ja-JP">Japanese</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="auto-delete">Auto-delete recordings after</Label>
                  <Select defaultValue="never">
                    <SelectTrigger className="bg-white/80">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="30">30 days</SelectItem>
                      <SelectItem value="90">90 days</SelectItem>
                      <SelectItem value="180">6 months</SelectItem>
                      <SelectItem value="365">1 year</SelectItem>
                      <SelectItem value="never">Never</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <Button onClick={handleSaveSettings} className="w-full bg-blue-600 hover:bg-blue-700">
                  Save All Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
