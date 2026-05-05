package com.example; // Package declaration for the com.example package

//---------------------------------------------Kalkulator class definition---------------------------------------
public class Kalkulator {
    
    int hasil = 0; // Variabel untuk menyimpan hasil operasi
//--------------------------------------------------------------------------------------------------------------
//-------------Method untuk operasi penjumlahan
    public int hitungPenjumlahan(int x, int y) {
        hasil = x + y;
        System.out.println("Operasi Penjumlahan");
        System.out.println(x+" + "+y+" = "+hasil);
        return hasil;
    }
//-------------Method untuk operasi penjumlahan
//--------------------------------------------------------------------------------------------------------------
//-------------Method untuk operasi pengurangan
    public int hitungPengurangan(int x, int y) {
        hasil = x - y;
        System.out.println("Operasi Pengurangan");
        System.out.println(x+" - "+y+" = "+hasil);
        return hasil;
    }
//-------------Method untuk operasi pengurangan
//--------------------------------------------------------------------------------------------------------------
//-------------Method untuk operasi perkalian
    public int hitungPerkalian(int x, int y) {
        hasil = x * y; 
        System.out.println( "Operasi Perkalian"); 
        System.out.println(x+" *"+y+" = "+hasil); 
        return hasil;
    }
//-------------Method untuk operasi perkalian
//--------------------------------------------------------------------------------------------------------------
//-------------Method untuk operasi pembagian
    public int hitungPembagian(int x, int y) {
        if (y == 0) {
            throw new ArithmeticException("Tidak bisa dibagi nol");
        }
        hasil = x / y;
        System.out.println("Operasi Pembagian"); 
        System.out.println(x+" /"+y+" = "+hasil); 
        return hasil;
    }
//-------------Method untuk operasi pembagian
}
//---------------------------------------------Kalkulator class definition---------------------------------------