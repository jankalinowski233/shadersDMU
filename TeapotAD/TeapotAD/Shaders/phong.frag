#version 430

in vec3 vertPos;
in vec3 N; //light vector normal
in vec3 lightPos;

/*TODO:: Complete your shader code for a full Phong shading*/ 

uniform struct MatInfo
{
	vec3 Ka;   //Ambient reflectivity
	vec3 Kd;  //Diffuse reflectivity
	vec3 Ks; //Specular reflectivity
	float shininess;
} mat;

uniform struct LightInfo
{
	vec3 lightPos;

	vec3 La;	//Ambient light intensity
	vec3 Ld;   //Diffuse light intensity
	vec3 Ls;  //Specular light intensity

	float constant;
	float linear;
	float quad;

} light;

float Attenuation()
{
	float dist = length(lightPos - vertPos);
	float attenuation =	 1.0f / (light.constant + (light.linear * dist) + (light.quad * (dist * dist)));

	return attenuation;
}


// complete to a full phong shading
layout( location = 0 ) out vec4 FragColour;

vec4 AmbientLight()
{
	vec4 Iamb = vec4(mat.Ka, 1.0f) * vec4(light.La,1.0f);

	return Iamb;
}

vec4 DiffuseLight(vec3 normal)
{
	//calculate Diffuse Light Intensity making sure it is not negative and is clamped 0 to 1  

	vec4 Id = vec4(mat.Kd, 1.0f) * vec4(light.Ld, 1.0f) * max(dot(N, normal), 0.0);
	Id = clamp(Id, 0.0, 1.0);

	return Id;
}

vec4 SpecularLight(vec3 normal)
{
	vec3 E = normalize(-vertPos); //eye (camera) coordinates
    vec3 R = normalize(-reflect(normal, N)); //reflection --> get the normal of the vertex in order to reflect light

	vec4 Ispec = vec4(mat.Ks, 1.0f) * vec4(light.Ls, 1.0f) * pow(max(dot(R, E), 0.0), mat.shininess);
	Ispec = clamp(Ispec, 0.0, 1.0);

	return Ispec;
}

void main() 
{
	vec3 L = normalize(lightPos - vertPos);	//normal vector between light position and vertex position

   FragColour = AmbientLight() + (DiffuseLight(L) * Attenuation()) + (SpecularLight(L) * Attenuation());
}


