#include "Definitions.h"

int idTask1, idTask2, idTask3, idTask4, idTask5;
int i;
WDOG_ID WDPosCrit;
int charge=50;
int dem=1, mult=2;
int posActuelle[3], diff[3], directionVent[3]; // en degré
int rotationMat[3]; // 1 sens horaire -1 sens antihoraire 0 rien
int bloquerRotor[3]; // 1 on bloque 0 on débloque
int stop[3], start[3];
boolean posOK[3]; 
int posCritTimerStart[3], posCritTimer[3];

void alarme(){
	taskSuspend(idTask3);
	taskSuspend(idTask4);
	taskSuspend(idTask5);
}

void GestionCharge()
{
	if(charge == 100){
		mult=2;
		dem=1;
	}
	
	if(charge<=15){
		mult=1;
		dem=2;
	}
	
}

void GestionEolien(int i){
	if(posOK[i]==false && posCritTimer[i]>=(15*60)){ // si position critique depuis plus de 15 min
		posCritTimer[i] = 0;
		bloquerRotor[i] = 1;
		alarme();
	}
	
	if(stop[i] == 1){ // Si demande de stop
		bloquerRotor[i] = 1;
	}
	
	if(start[i] == 1){ // Si demande de start
		bloquerRotor[i] = 0;
	}
}

void DirectionVent(int i){
	diff[i]=abs(directionVent[i]-(posActuelle[i] + 90)); // Calcul de la difference entre la position voulu et la position actuelle
	
	if(diff[i]>180) {
		rotationMat[i] = 1;
	}
	if(diff[i]<=180){
		rotationMat[i] = -1;
	}
	if(diff[i]>20){
		posOK[i] = false; // position critique
		if(posCritTime[i] == 0){
			posCritTimerStart[i] = clock_gettime(CLOCK_REALTIME, &tp); // Debut de la position critique
			if(wdStart(WDPosCrit, 100, (FUNCPTR)WDPosCrit, i) == ERROR) // Lancement du wd qui actualise surveille le temps passé
			{
				printf("WDPosCrit Error");
			}
		}
	}
	if(diff[i]<=20){ // position non critique
		posOK[i] = true;
	}
}

void CapteurRotation(int i){
	if(rotationMat[i] == 1){ //Sens horaire
		posActuelle[i]=posActuelle[i]+1;
	}
	
	if(rotationMat[i] == -1){ //Sens antihoraire
		posActuelle[i] = posActuelle[i]-1;
	}
}

void WDPosCrit(){
	posCritTimer[i] = posCritTimerStart[i] - clock_gettime(CLOCK_REALTIME, &tp); // Combien de temps en pos critique
	if(posCritTimer[i] && posOK==false < (15*60)){ // Durée limite non atteinte et tjrs en pos critique -> on relance le watchdog
		if(wdStart(WDPosCrit, 100, (FUNCPTR)WDPosCrit, i) == ERROR)
		{
			printf("WDPosCrit Error");
		}
	}
}

void Test(){
	
}

int main()
{
	/* Semaphores */
	
	/* WatchDogs */
	
	WDPosCrit = wdCreate();
		
	/* Spawn Tasks */
	
	idTask1 = taskSpawn("GestionCharge",200,
		                0x100,2000,(FUNCPTR)GestionCharge,
		                0,0,0,0,0,0,0,0,0,0);
	
	idTask2 = taskSpawn("Test",200,
			            0x100,2000,(FUNCPTR)Test,
			            0,0,0,0,0,0,0,0,0,0);
	
	idTask3 = taskSpawn("GestionEolien",200,
				        0x100,2000,(FUNCPTR)GestionEolien,
				        2,0,0,0,0,0,0,0,0,0);
	
	idTask4 = taskSpawn("DirectionVent",200,
					    0x100,2000,(FUNCPTR)DirectionVent,
					    2,0,0,0,0,0,0,0,0,0);
	
	idTask5 = taskSpawn("CapteurRotation",200,
						0x100,2000,(FUNCPTR)CapteurRotation,
						2,0,0,0,0,0,0,0,0,0);
	
	return EXIT_SUCCESS;
}
