package console

import (
	"fmt"

	"github.com/example/{{project_name}}/internal/application"
)

func PrintGreeting(name string) {
	g := application.Greet(name)
	fmt.Println(g.Text)
}
