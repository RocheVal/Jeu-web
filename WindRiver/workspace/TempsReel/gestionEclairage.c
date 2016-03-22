void gestionEclairage()
{
	int eclairage_envoye;
	
	int eclairage_demande;
	int eclairage_restant;
	//TODO
	int eclairage_global; //Recuperation valeur Capteur
	int onduleur; //Valeur à envoyer à l'onduleur
	int heure; //Récupération Heure
	int start;
	eclairage_envoye = 0;
	start = 1;
	
	
	
	if(start) //attente signal start //TODO
	{
		while(1) //rebouclage
		{
			if(heure > 21 && heure <= 24) // Créneau 21h-00h
			{
				eclairage_demande = 100;
			}
			else if(heure < 0 && heure <= 6) // Créneau 00h-6h
			{
				eclairage_demande = 61;
			}
			else if(heure < 6 && heure <= 9) //Créneau 6h-9h
			{
				eclairage_demande = 81;		
			}
			else //Créneau 9h-21h
			{
				eclairage_demande = 0;			
			}
			
			//Calcul de l'éclairage restant
			eclairage_restant = eclairage_demande - (eclairage_global - eclairage_envoye);
			
			
			if(0 <= eclairage_restant)  //  0 <=
			{
				onduleur = 0;
				eclairage_envoye = 0;
			}
			else if(0 < eclairage_restant && eclairage_restant <= 37) //0-37
			{
				onduleur = 30;
				eclairage_envoye = 37;
			}
			else if(37 < eclairage_restant && eclairage_restant <= 55) //37-55
			{
				onduleur = 120;
				eclairage_envoye = 55;
			}
			else if(55 < eclairage_restant && eclairage_restant <= 73) //55-73
			{
				onduleur = 160;
				eclairage_envoye = 73;
			}
			else if(73 < eclairage_restant && eclairage_restant <= 82) //73-82
			{
				onduleur = 180;
				eclairage_envoye = 82;
			}
			else  														//82-100
			{
				onduleur = 220;
				eclairage_envoye = 100;
			}
		}
	}
	
	
}
