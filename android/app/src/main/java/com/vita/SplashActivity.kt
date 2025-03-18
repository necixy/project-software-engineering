package com.vita // make sure this is your package name

import android.content.Intent
import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity

class SplashActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        val intent = Intent(this, MainActivity::class.java)
        startActivity(intent)
        finish()
    }
}


// package com.vita; // make sure this is your package name

// import android.content.Intent;
// import android.os.Bundle;
// // import android.support.v7.app.AppCompatActivity;
// import androidx.appcompat.app.AppCompatActivity;

// public class SplashActivity extends AppCompatActivity {
//     @Override
//     protected void onCreate(Bundle savedInstanceState) {
//         super.onCreate(savedInstanceState);

//         Intent intent = new Intent(this, MainActivity.class);
//         startActivity(intent);
//         finish();
//     }
// }