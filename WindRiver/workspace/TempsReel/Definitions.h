/********************************************************/
/* Liste des fichiers .h a inclure pour utiliser VxWorks*/
/********************************************************/

#include "vxWorks.h" 
#include "stdio.h"  
#include "stdlib.h"
#include "semLib.h" 
#include "msgQLib.h" 
#include "string.h"
#include "sysLib.h" 
#include "taskLib.h" 
#include "kernelLib.h"
#include "intLib.h"
#include "time.h" 
#include "tickLib.h" 
#include "logLib.h" 
#include "sigLib.h"
#include "signal.h"
#include "wdLib.h"

/********************************************************/
/* Definition d'un pseudo type boolean et des 2 valeurs	*/
/* permettant de manipuler des expressions booleennes	*/
/********************************************************/

#define boolean int 
#define true 1 
#define false 0
