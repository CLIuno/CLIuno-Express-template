import { IsString, IsNotEmpty } from "class-validator";

class Route {
    @IsString()
    @IsNotEmpty()
    originator: string | unknown;

    // Add more properties and validation decorators as needed
}

export default Route;
