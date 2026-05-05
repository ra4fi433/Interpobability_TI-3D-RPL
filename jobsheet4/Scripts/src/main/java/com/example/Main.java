
package com.example; // Package declaration for the com.example package
 
import org.apache.xmlrpc.WebServer; // Import the WebServer class from the Apache XML-RPC library

//---------------------------------------------Main class definition---------------------------------------
public class Main {

    public static void main(String[] args) {
        try {
            // Create a new WebServer instance on port 8080
            WebServer server = new WebServer(8080);
            // Add an instance of the Kalkulator class as a handler for XML-RPC requests
            server.addHandler("server", new Kalkulator());
            // Start the XML-RPC server
            server.start();
            System.out.println("Server berjalan pada port 8080 . . .");
            // Keep the JVM alive indefinitely to allow the server to continue running
            // IMPORTANT: keep JVM alive
            Thread.sleep(Long.MAX_VALUE);
            // Note: The above line will keep the server running indefinitely. In a real application, you might want to implement a more graceful shutdown mechanism.
        } catch (Exception e) {
            e.printStackTrace(); // better than getMessage()
        }
    }
}
//---------------------------------------------Main class definition---------------------------------------