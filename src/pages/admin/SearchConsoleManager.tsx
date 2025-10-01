import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { 
  Search, 
  Download, 
  ExternalLink, 
  CheckCircle2, 
  AlertCircle,
  BarChart3,
  Globe,
  Zap,
  FileText
} from 'lucide-react';
import { generateSitemap, generateRobotsTxt } from '@/utils/sitemapGenerator';
import { fetchVideosFromSupabase } from '@/services/supabaseApi';

export default function SearchConsoleManager() {
  const [verificationCode, setVerificationCode] = useState('');
  const [sitemapContent, setSitemapContent] = useState('');
  const [robotsContent, setRobotsContent] = useState('');
  const [videoCount, setVideoCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      // Generate sitemap and robots.txt
      const sitemap = await generateSitemap();
      const robots = generateRobotsTxt();
      
      setSitemapContent(sitemap);
      setRobotsContent(robots);
      
      // Get video count
      const videos = await fetchVideosFromSupabase();
      setVideoCount(videos.length);
      
      // Load saved verification code from localStorage
      const savedCode = localStorage.getItem('gsc_verification_code');
      if (savedCode) {
        setVerificationCode(savedCode);
      }
    } catch (error) {
      console.error('Error loading GSC data:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to load Search Console data',
      });
    } finally {
      setLoading(false);
    }
  };

  const saveVerificationCode = () => {
    localStorage.setItem('gsc_verification_code', verificationCode);
    toast({
      title: 'Success',
      description: 'Verification code saved successfully',
    });
  };

  const downloadSitemap = () => {
    const blob = new Blob([sitemapContent], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sitemap.xml';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const downloadRobots = () => {
    const blob = new Blob([robotsContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'robots.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const gscSetupSteps = [
    {
      title: 'Add Property to GSC',
      description: 'Go to Google Search Console and add your website as a new property',
      status: 'pending',
      link: 'https://search.google.com/search-console'
    },
    {
      title: 'Verify Ownership',
      description: 'Use the HTML tag method with the verification code below',
      status: verificationCode ? 'completed' : 'pending',
      action: true
    },
    {
      title: 'Submit Sitemap',
      description: 'Upload the generated sitemap.xml to help Google discover your content',
      status: 'pending',
      action: true
    },
    {
      title: 'Monitor Performance',
      description: 'Check Core Web Vitals, indexing status, and search performance',
      status: 'ongoing',
      link: 'https://search.google.com/search-console/performance'
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold bg-gradient-viral bg-clip-text text-transparent">
          Google Search Console
        </h1>
        <p className="text-muted-foreground">
          Monitor and optimize your site's presence in Google Search results
        </p>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-viral rounded-lg flex items-center justify-center">
                <Globe className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Pages</p>
                <p className="text-2xl font-bold">{videoCount + 2}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-trending rounded-lg flex items-center justify-center">
                <FileText className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Videos</p>
                <p className="text-2xl font-bold">{videoCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-hero rounded-lg flex items-center justify-center">
                <Zap className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">SEO Score</p>
                <p className="text-2xl font-bold text-green-600">Good</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-accent rounded-lg flex items-center justify-center">
                <BarChart3 className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <Badge variant={verificationCode ? "default" : "secondary"}>
                  {verificationCode ? 'Verified' : 'Pending'}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Setup Steps */}
      <Card>
        <CardHeader>
          <CardTitle>Google Search Console Setup</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {gscSetupSteps.map((step, index) => (
            <div key={index} className="flex items-start gap-4 p-4 border border-border/50 rounded-lg">
              <div className="flex-shrink-0 mt-1">
                {step.status === 'completed' ? (
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                ) : step.status === 'ongoing' ? (
                  <AlertCircle className="h-5 w-5 text-blue-500" />
                ) : (
                  <div className="w-5 h-5 border-2 border-muted-foreground rounded-full" />
                )}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.description}</p>
                {step.link && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-2"
                    onClick={() => window.open(step.link, '_blank')}
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Open GSC
                  </Button>
                )}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Verification */}
      <Card>
        <CardHeader>
          <CardTitle>Site Verification</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="verification">Google Search Console Verification Code</Label>
            <div className="flex gap-2">
              <Input
                id="verification"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                placeholder="Enter verification meta tag content"
              />
              <Button onClick={saveVerificationCode} disabled={!verificationCode}>
                Save
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Copy the content attribute from the meta tag provided by Google Search Console
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Sitemap */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Sitemap Management
            <Button variant="outline" size="sm" onClick={downloadSitemap}>
              <Download className="h-4 w-4 mr-2" />
              Download XML
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground mb-2">
                Generated sitemap includes {videoCount + 2} pages
              </p>
              <Textarea
                value={sitemapContent}
                readOnly
                className="font-mono text-xs"
                rows={8}
              />
            </div>
            <Button
              variant="viral"
              onClick={() => window.open('https://search.google.com/search-console/sitemaps', '_blank')}
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Submit to Google
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Robots.txt */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Robots.txt
            <Button variant="outline" size="sm" onClick={downloadRobots}>
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            value={robotsContent}
            readOnly
            className="font-mono text-xs"
            rows={6}
          />
        </CardContent>
      </Card>
    </div>
  );
}