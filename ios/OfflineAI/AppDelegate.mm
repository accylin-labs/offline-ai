#import "AppDelegate.h"

// App Check
#import "RNFBAppCheckModule.h" 
#import <Firebase.h>


#import <React/RCTBundleURLProvider.h>
#import <RNFSBackgroundDownloads.h>

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  // Initialize Firebase
  // This is used exclusively for sending model benchmarks (with user consent) to Firebase.
  // Firebase is used for App Check functionality, allowing unauthenticated users to submit their benchmark data securely.
  [RNFBAppCheckModule sharedInstance];
  [FIRApp configure]; 

  self.moduleName = @"OfflineAI";
  // You can add your custom initial props in the dictionary below.
  // They will be passed down to the ViewController used by React Native.
  self.initialProps = @{};

  return [super application:application didFinishLaunchingWithOptions:launchOptions];
}

- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
  return [self bundleURL];
}

- (NSURL *)bundleURL
{
#if DEBUG
  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index"];
#else
  return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
#endif
}

- (void)application:(UIApplication *)application handleEventsForBackgroundURLSession:(NSString *)identifier completionHandler:(void (^)())completionHandler
{
  [RNFSBackgroundDownloads setCompletionHandlerForIdentifier:identifier completionHandler:completionHandler];
}

@end
