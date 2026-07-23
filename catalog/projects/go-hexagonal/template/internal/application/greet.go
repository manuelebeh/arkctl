package application

import "github.com/example/{{project_name}}/internal/domain"

func Greet(name string) domain.Greeting {
	return domain.Greeting{Text: "Hello, " + name}
}
