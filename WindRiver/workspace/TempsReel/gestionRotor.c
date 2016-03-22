#include "Definitions.h"

//Declarations Watchdogs, 1 pour chaque éolienne et pour chaque temps (4,6 et 10min)
WDOG_ID WDt4[3];
WDOG_ID WDt6[3];
WDOG_ID WDt10[3];

//Declaratioans Semaphores, 1 pour chaque éolienne et pour le controle de chaque temps (4,6 et 10min)
SEM_ID mutexWDt4[3];
SEM_ID mutexWDt6[3];
SEM_ID mutexWDt10[3];

int i;

//Handler de chaque WatchDogs
void WDt4_Handler()
{
	semBGive(mutexWDt4[i]);
}

void WDt6_Handler()
{
	semBGive(mutexWDt6[i]);
}

void WDt10_Handler()
{
	semBGive(mutexWDt10[i]);
}

void gestionRotor(int j)
{
	//Passer l'eolienne j en variable globale pour pouvoir l'utiliser dans les Handler des WatchDogs
	i = j;
	
	int start[3];  
	int blocage_rotor[3];
	int frein[3];
	int vitesse[3];
	int deblocage[3];
	
	int tickpersec = sysClkRateGet();
	
	//TODO E/S
	blocage_rotor[i] = 1;
	start[i] = 1;
	frein[i] = 1;
	vitesse[i] = 0;
	deblocage[i] = 1;
	
	//Creation WatchDogs qui serviront de timer
	WDt4[i] = wdCreate();
	WDt6[i] = wdCreate();
	WDt10[i] = wdCreate();
	
	//Creation Mutex qui bloqueront l'exec le temps d'attente du WD pour les timers
	mutexWDt4[i] = semBCreate(SEM_Q_FIFO, SEM_EMPTY);
	mutexWDt6[i] = semBCreate(SEM_Q_FIFO, SEM_EMPTY);
	mutexWDt10[i] = semBCreate(SEM_Q_FIFO, SEM_EMPTY);
	
	if(start[i]) //Commande de démarrage
	{
		while(1) //rebouclage
		{
			if(blocage_rotor[i]) //Branche 1
			{
				frein[i] = 2;
				
				// mise en place du timer t=4
				
				if(wdStart(WDt4, 4*tickpersec, (FUNCPTR)WDt4_Handler, NULL) == ERROR)
				{
					printf("WDt4 Error");
				}
				
				//Blocage en attente du WatchDogs WDt4 associé à l'éolienne i
				semBTake(mutexWDt4[i], WAIT_FOREVER);
				
				//Réacquisition Vitesse
				//TODO
				
				//si vitesse > 20 on attend 6 min sinon on ne fait rien
				if(vitesse[i] > 20)
				{
					if(wdStart(WDt6, 6*tickpersec , (FUNCPTR)WDt6_Handler, NULL) == ERROR)
					{
						printf("WDt6 Error");
					}
					
					//Blocage en attente du WatchDogs WDt6 associé à l'éolienne i
					semBTake(mutexWDt6[i], WAIT_FOREVER);
				}
				
				//fin de la séparation des branches du Petri
				
				//Arret du rotor, a ce moment là on a attendu suffisamment pour passer le rotor en pos 3
				frein[i] = 3;
				
				//TODO Rattacher un mutex qui attend le signal déblocage, pour gérer le déblocage de fin de branche
				while(deblocage[i]){}
				
				//Deblocage autorisé, remet le frein en pos 1
				frein[i] = 1;
				
				//Fin Branche
			}
			if(vitesse[i] > 50) //Branche 2
			{
				frein[i] = 2;
				
				//mise en place du timer t=10
				
				if(wdStart(WDt10, 10*tickpersec, (FUNCPTR)WDt10_Handler, NULL) == ERROR)
				{
					printf("WD Error");
				}
				
				//Blocage en attente du WatchDogs WDt6 associé à l'éolienne i
				semBTake(mutexWDt10[i], WAIT_FOREVER);
				
				//Arret du rotor, a ce moment là on a attendu suffisamment pour passer le rotor en pos 3
				frein[i] = 3;
				
				//Attendre que le vent passe en dessous de 50m/h
				while(vitesse[i] >= 50)
				{
					//TODO MAJ vitesse[i]
				}
				
				//Fin Branche
			}
		}
	}
}


