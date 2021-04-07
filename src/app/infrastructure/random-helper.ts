const lastNames = ['Smith','Johnson','Williams','Brown','Jones','Miller','Davis','Garcia','Rodriguez','Wilson','Martinez','Anderson','Taylor','Thomas','Hernandez','Moore','Martin','Jackson','Thompson','White','Lopez','Lee','Gonzalez','Harris','Clark','Lewis','Robinson','Walker','Perez','Hall','Young','Allen','Sanchez','Wright','King','Scott','Green','Baker','Adams','Nelson','Hill','Ramirez','Campbell','Mitchell','Roberts','Carter','Phillips','Evans','Turner','Torres','Parker','Collins','Edwards','Stewart','Flores','Morris','Nguyen','Murphy','Rivera','Cook','Rogers','Morgan','Peterson','Cooper','Reed','Bailey','Bell','Gomez','Kelly','Howard','Ward','Cox','Diaz','Richardson','Wood','Watson','Brooks','Bennett','Gray','James','Reyes','Cruz','Hughes','Price','Myers','Long','Foster','Sanders','Ross','Morales','Powell','Sullivan','Russell','Ortiz','Jenkins','Gutierrez','Perry','Butler',];
const firstNames = ['Mary','Anna','Emma','Elizabeth','Minnie','Margaret','Ida','Alice','Bertha','Sarah','Annie','Clara','Ella','Florence','Cora','Martha','Laura','Nellie','Grace','Carrie','Maude','Mabel','Bessie','Jennie','Gertrude','Julia','Hattie','Edith','Mattie','Rose','Catherine','Lillian','Ada','Lillie','Helen','Jessie','Louise','Ethel','Lula','Myrtle','Eva','Frances','Lena','Lucy','Edna','Maggie','Pearl','Daisy','Fannie','Josephine','Dora','John','William','James','Charles','George','Frank','Joseph','Thomas','Henry','Robert','Edward','Harry','Walter','Arthur','Fred','Albert','Samuel','David','Louis','Joe','Charlie','Clarence','Richard','Andrew','Daniel','Ernest','Will','Jesse','Oscar','Lewis','Peter','Benjamin','Frederick','Willie','Alfred','Sam','Roy','Herbert','Jacob','Tom','Elmer','Carl','Lee','Howard','Martin','Michael','Bert','Herman','Jim','Francis','Harvey'];
const now = Date.now();
const yearInMs = 365 * 24 * 60 * 60 * 1000;

export const getRandomFirstName = (): string => {
  return firstNames[getRandomInt(0, firstNames.length-1)]; 
}

export const getRandomLastName = (): string => {
  return lastNames[getRandomInt(0, lastNames.length-1)];
}

export const getRandomInt = (min: number, max: number): number => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const getRandomDate = (): Date => {
  return new Date(now - getRandomInt(1, yearInMs));
}
