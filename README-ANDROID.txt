CBSE Question Paper Designer — Android App (.apk) Builder
=========================================================

Two easy ways to get your Android .apk file (no Android Studio needed):

OPTION 1: Automatic GitHub Cloud Build (included in this zip)
--------------------------------------------------------------
1. Unzip `cbse-paper-android.zip`.
2. Create a new GitHub repository (or upload these files into a repo)
   making sure `package.json`, `capacitor.config.json`, `www/`, and
   `.github/workflows/build-android-apk.yml` are all uploaded.
3. Open the repository's **Actions** tab on GitHub.
4. Wait ~2–3 minutes for **Build Android APK** to finish (green check).
5. Click the finished workflow run and download **cbse-paper-designer-apk**
   to get `app-debug.apk`.
6. Copy `app-debug.apk` to your Android phone and tap it to install
   (enable "Install unknown apps" if prompted).

OPTION 2: Instant APK via PWABuilder (if you already use GitHub Pages)
----------------------------------------------------------------------
1. Open https://www.pwabuilder.com/
2. Paste your GitHub Pages URL and click **Start**.
3. Click **Package for Stores** -> **Android** -> **Generate Package**
   to download a signed `.apk` directly.
