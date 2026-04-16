# This is a configuration file for ProGuard.
# http://proguard.sourceforge.net/index.html#manual/usage.html

-dontusemixedcaseclassnames

# Keep line numbers for debugging stack traces
-keepattributes SourceFile,LineNumberTable

# Keep custom application classes
-keep class com.helptidesk.** { *; }

# Keep support library classes
-keep class androidx.** { *; }
-keep interface androidx.** { *; }
